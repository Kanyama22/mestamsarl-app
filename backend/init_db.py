import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Initial data
categories = [
    {
        "id": 'energie-renouvelable',
        "name": 'Énergies renouvelables',
        "image": 'https://images.unsplash.com/photo-1613665813446-82a78c468a1d',
        "description": 'Panneaux solaires, éoliennes et équipements verts'
    },
    {
        "id": 'equipement-construction',
        "name": 'Équipement de Construction',
        "image": 'https://images.unsplash.com/photo-1603814744450-36f978490b11',
        "description": 'Machines et équipements pour la construction'
    },
    {
        "id": 'equipement-electrique',
        "name": 'Équipement Électrique',
        "image": 'https://images.unsplash.com/photo-1517089152318-42ec560349c0',
        "description": 'Générateurs, transformateurs et matériel électrique'
    },
    {
        "id": 'machines-industrielles',
        "name": 'Machines Industrielles',
        "image": 'https://images.unsplash.com/photo-1659707751291-3f8666211d07',
        "description": 'Machines pour production et fabrication'
    },
    {
        "id": 'chaussures-hommes',
        "name": 'Chaussures hommes',
        "image": 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4',
        "description": 'Chaussures formelles et décontractées pour hommes'
    },
    {
        "id": 'chaussures-femmes',
        "name": 'Chaussures femmes',
        "image": 'https://images.unsplash.com/photo-1535043934128-cf0b28d52f95',
        "description": 'Chaussures élégantes pour femmes'
    }
]

products = [
    {
        "id": '1',
        "name": 'Maison préfabriquée',
        "price": 1590,
        "image": 'https://images.unsplash.com/photo-1680975183971-95f4a0d2b508',
        "category": 'equipement-construction',
        "description": 'Maison préfabriquée moderne et durable, installation rapide. Construction de qualité avec matériaux résistants.',
        "featured": True,
        "specifications": {
            "surface": '60m²',
            "chambres": '2',
            "material": 'Acier et panneaux sandwich',
            "garantie": '5 ans'
        }
    },
    {
        "id": '2',
        "name": 'LENOVO THINKPAD Ordinateur portable',
        "price": 149,
        "image": 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853',
        "category": 'machines-industrielles',
        "description": 'Ordinateur portable professionnel, parfait pour le travail et les études. Performances fiables et durabilité.',
        "featured": True,
        "specifications": {
            "processeur": 'Intel Core i5',
            "ram": '8GB',
            "stockage": '256GB SSD',
            "ecran": '14 pouces'
        }
    },
    {
        "id": '3',
        "name": 'Robe de mariée sirène africaine',
        "price": 194,
        "image": 'https://images.unsplash.com/photo-1585241920473-b472eb9ffbae',
        "category": 'chaussures-femmes',
        "description": 'Robe de mariée élégante avec design africain unique. Tissu de haute qualité avec broderie raffinée.',
        "featured": True,
        "specifications": {
            "tailles": 'S à XL',
            "couleur": 'Blanc ivoire',
            "style": 'Sirène',
            "matiere": 'Satin et dentelle'
        }
    },
    {
        "id": '4',
        "name": 'Pack de batteries au lithium',
        "price": 845,
        "image": 'https://images.unsplash.com/photo-1592318348310-f31b61a931c8',
        "category": 'equipement-electrique',
        "description": 'Batterie lithium haute capacité pour installations solaires et véhicules électriques. Longue durée de vie.',
        "featured": True,
        "specifications": {
            "capacite": '100Ah',
            "voltage": '48V',
            "cycles": '3000+',
            "garantie": '3 ans'
        }
    },
    {
        "id": '5',
        "name": 'Perruque pour enfants',
        "price": 67,
        "image": 'https://images.unsplash.com/photo-1568639837177-f3aea8272a8f',
        "category": 'chaussures-femmes',
        "description": 'Perruque de qualité pour enfants, douce et confortable. Différents styles disponibles.',
        "featured": True,
        "specifications": {
            "longueur": 'Moyenne',
            "materiau": 'Fibres synthétiques',
            "couleurs": 'Noir, Marron',
            "age": '5-12 ans'
        }
    },
    {
        "id": '6',
        "name": 'Rideaux',
        "price": 7.9,
        "image": 'https://images.unsplash.com/photo-1528822855841-e8bf3134cdc9',
        "category": 'machines-industrielles',
        "description": 'Rideaux décoratifs de qualité, divers motifs et couleurs. Installation facile.',
        "featured": True,
        "specifications": {
            "dimensions": '140x240cm',
            "materiau": 'Polyester',
            "entretien": 'Lavable en machine',
            "style": 'Moderne'
        }
    },
    {
        "id": '7',
        "name": 'Panneau solaire 300W',
        "price": 250,
        "image": 'https://images.unsplash.com/photo-1613665813446-82a78c468a1d',
        "category": 'energie-renouvelable',
        "description": 'Panneau solaire monocristallin haute efficacité. Installation facile, résistant aux intempéries.',
        "featured": False,
        "specifications": {
            "puissance": '300W',
            "efficacite": '21%',
            "dimensions": '1650x992x40mm',
            "garantie": '25 ans'
        }
    },
    {
        "id": '8',
        "name": 'Générateur diesel 10KVA',
        "price": 1200,
        "image": 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e',
        "category": 'equipement-electrique',
        "description": 'Générateur diesel robuste et fiable pour usage domestique et industriel.',
        "featured": False,
        "specifications": {
            "puissance": '10KVA',
            "moteur": 'Diesel',
            "reservoir": '25L',
            "autonomie": '8 heures'
        }
    },
    {
        "id": '9',
        "name": 'Machine à coudre industrielle',
        "price": 320,
        "image": 'https://images.unsplash.com/photo-1659707751291-3f8666211d07',
        "category": 'machines-industrielles',
        "description": 'Machine à coudre professionnelle, idéale pour ateliers et écoles.',
        "featured": False,
        "specifications": {
            "type": 'Industrielle',
            "vitesse": '5000 pts/min',
            "moteur": 'Électrique 220V',
            "usage": 'Professionnel'
        }
    },
    {
        "id": '10',
        "name": 'Chaussures en cuir homme',
        "price": 45,
        "image": 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4',
        "category": 'chaussures-hommes',
        "description": 'Chaussures formelles en cuir véritable. Confort et élégance.',
        "featured": False,
        "specifications": {
            "materiau": 'Cuir véritable',
            "pointures": '40-46',
            "couleur": 'Marron/Noir',
            "style": 'Formel'
        }
    },
    {
        "id": '11',
        "name": 'Excavatrice 20 tonnes',
        "price": 35000,
        "image": 'https://images.unsplash.com/photo-1603814744450-36f978490b11',
        "category": 'equipement-construction',
        "description": 'Excavatrice hydraulique pour travaux de terrassement et construction.',
        "featured": False,
        "specifications": {
            "poids": '20 tonnes',
            "profondeur": '6.5m',
            "moteur": 'Diesel',
            "garantie": '2 ans'
        }
    },
    {
        "id": '12',
        "name": 'Pompes à eau haute pression',
        "price": 580,
        "image": 'https://images.unsplash.com/photo-1581092160607-ee22621dd758',
        "category": 'machines-industrielles',
        "description": 'Pompe centrifuge industrielle pour irrigation et approvisionnement en eau.',
        "featured": False,
        "specifications": {
            "debit": '50m³/h',
            "hauteur": '30m',
            "puissance": '5.5kW',
            "materiau": 'Fonte'
        }
    }
]

async def init_database():
    mongo_url = os.environ['MONGO_URL']
    client = AsyncIOMotorClient(mongo_url)
    db = client[os.environ['DB_NAME']]
    
    # Check if data already exists
    existing_categories = await db.categories.count_documents({})
    
    if existing_categories == 0:
        print("Initializing database with mock data...")
        
        # Insert categories
        await db.categories.insert_many(categories)
        print(f"Inserted {len(categories)} categories")
        
        # Insert products
        await db.products.insert_many(products)
        print(f"Inserted {len(products)} products")
        
        print("Database initialization complete!")
    else:
        print("Database already initialized.")
    
    client.close()

if __name__ == "__main__":
    asyncio.run(init_database())
