from django.apps import AppConfig


class ScrapeConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'Scrape'

    def ready(self):
        from .ScrapViews import getStart
        getStart()