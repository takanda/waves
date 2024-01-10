import pytest
from django.core.management import call_command
from rest_framework.test import APIClient


@pytest.fixture(autouse=True)
def setup_initial_data():
    # 初期データのセットアップ
    call_command('loaddata', 'vocabulary/fixtures/part_of_speech.json')

@pytest.fixture
def api_client():
    return APIClient()