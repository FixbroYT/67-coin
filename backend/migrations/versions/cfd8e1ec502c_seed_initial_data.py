"""seed initial data

Revision ID: cfd8e1ec502c
Revises: 8c67c88876e2
Create Date: 2026-09-27 17:30:18.406269

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'cfd8e1ec502c'
down_revision: Union[str, Sequence[str], None] = '8c67c88876e2'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.bulk_insert(
        sa.table('locations',
            sa.column('name', sa.String),
            sa.column('desc', sa.String),
            sa.column('cost', sa.Integer),
            sa.column('bonus_multiplier', sa.Float),
            sa.column('color', sa.String),
            sa.column('img_url', sa.String),
        ),
        [
            {'name': 'Home', 'desc': 'Your starting base — where the journey begins', 'cost': 0, 'bonus_multiplier': 1.0, 'color': '4A90D9', 'img_url': 'https://placehold.co/600x400?text=Home'},
            {'name': 'Neon City', 'desc': 'Bright lights and heavy traffic', 'cost': 500, 'bonus_multiplier': 1.5, 'color': 'E040FB', 'img_url': 'https://placehold.co/600x400?text=Neon+City'},
            {'name': 'Quantum Hub', 'desc': 'Next-gen server power', 'cost': 2000, 'bonus_multiplier': 2.2, 'color': '00E5FF', 'img_url': 'https://placehold.co/600x400?text=Quantum+Hub'},
            {'name': 'Desert Oasis', 'desc': 'Quiet desert hiding valuable resources', 'cost': 5000, 'bonus_multiplier': 3.0, 'color': 'F4A460', 'img_url': 'https://placehold.co/600x400?text=Desert+Oasis'},
            {'name': 'Crystal Caves', 'desc': 'Rare crystals give a massive boost', 'cost': 12000, 'bonus_multiplier': 4.5, 'color': '9C27B0', 'img_url': 'https://placehold.co/600x400?text=Crystal+Caves'},
            {'name': 'Orbit Station', 'desc': 'The peak of progress — mining in open space', 'cost': 30000, 'bonus_multiplier': 6.0, 'color': '607D8B', 'img_url': 'https://placehold.co/600x400?text=Orbit+Station'},
        ]
    )

    op.bulk_insert(
        sa.table('upgrades',
            sa.column('name', sa.String),
            sa.column('type', sa.String),
            sa.column('unlock_lvl', sa.Integer),
            sa.column('cost', sa.Integer),
            sa.column('bonus', sa.Float),
            sa.column('icon_name', sa.String),
        ),
        [
            {'name': 'Sturdy Finger', 'type': 'click', 'unlock_lvl': 1, 'cost': 100, 'bonus': 1, 'icon_name': 'MousePointerClick'},
            {'name': 'Mechanical Glove', 'type': 'click', 'unlock_lvl': 3, 'cost': 500, 'bonus': 3, 'icon_name': 'MousePointerClick'},
            {'name': 'Cyber Prosthetic', 'type': 'click', 'unlock_lvl': 7, 'cost': 2500, 'bonus': 8, 'icon_name': 'MousePointerClick'},

            {'name': 'Intern Helper', 'type': 'passive', 'unlock_lvl': 1, 'cost': 300, 'bonus': 1, 'icon_name': 'TrendingUp'},
            {'name': 'Automation', 'type': 'passive', 'unlock_lvl': 4, 'cost': 1500, 'bonus': 5, 'icon_name': 'TrendingUp'},
            {'name': 'Neural Miner', 'type': 'passive', 'unlock_lvl': 8, 'cost': 6000, 'bonus': 15, 'icon_name': 'TrendingUp'},

            {'name': 'Energy Drink', 'type': 'energy_restoration', 'unlock_lvl': 2, 'cost': 400, 'bonus': 2, 'icon_name': 'BatteryCharging'},
            {'name': 'Fast Charger', 'type': 'energy_restoration', 'unlock_lvl': 5, 'cost': 2000, 'bonus': 5, 'icon_name': 'BatteryCharging'},
            {'name': 'Nuclear Reactor', 'type': 'energy_restoration', 'unlock_lvl': 9, 'cost': 8000, 'bonus': 12, 'icon_name': 'BatteryCharging'},

            {'name': 'Extended Battery', 'type': 'max_energy', 'unlock_lvl': 2, 'cost': 350, 'bonus': 50, 'icon_name': 'Battery'},
            {'name': 'High-Capacity Cell', 'type': 'max_energy', 'unlock_lvl': 5, 'cost': 1800, 'bonus': 150, 'icon_name': 'Battery'},
            {'name': 'Quantum Battery', 'type': 'max_energy', 'unlock_lvl': 9, 'cost': 7000, 'bonus': 400, 'icon_name': 'Battery'},
        ]
    )

    op.bulk_insert(
        sa.table('leadmagnets',
            sa.column('name', sa.String),
            sa.column('icon_name', sa.String),
            sa.column('color', sa.String),
            sa.column('type', sa.String),
            sa.column('reward', sa.Integer),
            sa.column('url', sa.String),
        ),
        [
            {'name': 'Youtube', 'icon_name': 'tv-minimal-play', 'color': 'ed2d1f', 'type': 'youtube', 'reward': 10000, 'url': 'https://www.youtube.com'},
        ]
    )


def downgrade() -> None:
    op.execute("DELETE FROM leadmagnets")
    op.execute("DELETE FROM upgrades")
    op.execute("DELETE FROM locations")