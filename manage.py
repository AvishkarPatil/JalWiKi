#!/usr/bin/env python
"""Django's command-line utility for administrative tasks with env support."""
import os
import sys
import logging
from dotenv import load_dotenv


def main():
    """Run administrative tasks with environment-aware settings."""
    # Load environment variables from .env (if present)
    load_dotenv()

    # Get environment (default: development)
    env = os.getenv("ENV", "development").lower()

    # Dynamically set settings module
    settings_module = f"jalwiki_pro.settings.{env}" if env in ["development", "production"] else "jalwiki_pro.settings"
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", settings_module)

    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        logging.error("⚠ Django import failed. Ensure dependencies are installed and venv is active.")
        raise ImportError(
            "Couldn't import Django. Did you forget to install dependencies or activate your virtual environment?"
        ) from exc

    logging.info(f"✅ Running with settings: {settings_module}")
    execute_from_command_line(sys.argv)


if _name_ == "_main_":
    main()
