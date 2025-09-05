from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
from django.contrib.auth import get_user_model
from .models import Technique, Category, Region


User = get_user_model()


class PublicReadPaginationTests(APITestCase):
	def setUp(self):
		# Users
		self.staff = User.objects.create_user(
			email="staff@example.com",
			password="pass1234",
			username="staff",
			first_name="s",
			last_name="t",
			is_staff=True,
		)
		self.user = User.objects.create_user(
			email="user@example.com",
			password="pass1234",
			username="user",
			first_name="u",
			last_name="r",
		)

		# Data
		self.cat1 = Category.objects.create(name="Agriculture")
		self.cat2 = Category.objects.create(name="Household")
		self.reg1 = Region.objects.create(name="Maharashtra")
		self.reg2 = Region.objects.create(name="Karnataka")

		# Create >12 techniques to trigger pagination
		for i in range(15):
			t = Technique.objects.create(
				title=f"Technique {i}",
				summary="s",
				detailed_content="d",
				impact="medium",
				is_published=(i % 2 == 0),  # half published
				added_by=self.user,
			)
			t.categories.add(self.cat1 if i % 2 == 0 else self.cat2)
			t.regions.add(self.reg1 if i % 2 == 0 else self.reg2)

	def test_anonymous_techniques_only_published_and_paginated(self):
		url = "/api/techniques/"
		res = self.client.get(url)
		self.assertEqual(res.status_code, status.HTTP_200_OK)
		# Pagination keys
		self.assertIn("count", res.data)
		self.assertIn("next", res.data)
		self.assertIn("previous", res.data)
		self.assertIn("results", res.data)
		# Only published in results
		for item in res.data["results"]:
			self.assertTrue(item["is_published"])  # list uses TechniqueListSerializer

	def test_staff_sees_unpublished(self):
		client = APIClient()
		client.force_authenticate(user=self.staff)
		res = client.get("/api/techniques/")
		self.assertEqual(res.status_code, status.HTTP_200_OK)
		# Should include at least one unpublished
		has_unpublished = any(not item["is_published"] for item in res.data["results"]) or (res.data.get("count",0) > len([i for i in res.data["results"] if i["is_published"]]))
		self.assertTrue(has_unpublished)

	def test_anonymous_categories_and_regions_paginated(self):
		res_cat = self.client.get("/api/categories/")
		self.assertEqual(res_cat.status_code, status.HTTP_200_OK)
		for k in ["count", "next", "previous", "results"]:
			self.assertIn(k, res_cat.data)

		res_reg = self.client.get("/api/regions/")
		self.assertEqual(res_reg.status_code, status.HTTP_200_OK)
		for k in ["count", "next", "previous", "results"]:
			self.assertIn(k, res_reg.data)

	def test_page_size_override(self):
		res = self.client.get("/api/techniques/?page_size=5")
		self.assertEqual(res.status_code, status.HTTP_200_OK)
		self.assertLessEqual(len(res.data.get("results", [])), 5)
