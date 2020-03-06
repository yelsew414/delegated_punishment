from os import environ

# if you set a property in SESSION_CONFIG_DEFAULTS, it will be inherited by all configs
# in SESSION_CONFIGS, except those that explicitly override it.
# the session config can be accessed from methods in your apps as self.session.config,
# e.g. self.session.config['participation_fee']
EXTENSION_APPS = [
    'delegated_punishment',
]

SESSION_CONFIG_DEFAULTS = dict(
    real_world_currency_per_point=1.00, participation_fee=0.00, doc=""
)

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': 'django_db',
        'USER': 'postgres',
        'PASSWORD': 'password',
        'HOST': 'localhost',
        'PORT': '5432'
    }
}


SESSION_CONFIGS = [
    dict(
        name='delegated_punishment', 
        display_name="Delegated Punishment Game", 
        num_demo_participants=5,
        app_sequence=['welcome', 'delegated_punishment', 'survey'],
        session_identifier=0,
        low_to_high=True,
        tutorial_civilian_income=40,
        tutorial_officer_bonus=10,
        grain_conversion=.1,
        showup_payment=7,
        participant_endowment=10,
        balance_update_rate=500,
        skip_to_period=1,
    ),
    dict(
        name='survey',
        display_name='survey',
        num_demo_participants=5,
        app_sequence=['survey'],
    ),
    dict(
        name='welcome',
        display_name='welcome',
        num_demo_participants=5,
        app_sequence=['welcome'],
    ),
]

# ISO-639 code
# for example: de, fr, ja, ko, zh-hans
LANGUAGE_CODE = 'en'

# e.g. EUR, GBP, CNY, JPY
REAL_WORLD_CURRENCY_CODE = 'USD'
USE_POINTS = True
DEBUG = False


ROOMS = [
    dict(
        name='delegated_punishment',
        display_name='Delegated Punishment',
        participant_label_file=None,
    ),
    dict(name='live_demo', display_name='Room for live demo (no participant labels)'),
]

AUTH_LEVEL = environ.get('OTREE_AUTH_LEVEL', 'STUDY')

ADMIN_USERNAME = 'admin'
# for security, best to set admin password in an environment variable
ADMIN_PASSWORD = environ.get('OTREE_ADMIN_PASSWORD', 'delegated_punishment')

DEMO_PAGE_INTRO_HTML = """
Here are some oTree games.
"""

# don't share this with anybody.
SECRET_KEY = '6lertt4wlb09zj@4wyuy-p-6)i$vh!ljwx&r9bti6kgw54k-h8'

INSTALLED_APPS = ['otree']

# ROOT_URLCONF = 'urls'
