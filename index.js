const { faker } = require('@faker-js/faker');
const fs = require('fs');

let collQuantities = {
	'moderadores': 100,
	'productos': 100,
	'usuarios': 100,

	'adjuntos': 200,
	'amistades': 500,
	'cambios_divisa': 200,
	'carritos': 200,
	'equipos': 50,
	'juegos': 50,
	'salas': 30,
	'torneos': 50,

	'expansiones': 30,
	'participantes': 200,
	'mensajes': 500,
	'premios': 100,
	'productos_carrito': 500,
	'resenias': 200,
	'tiquetes': 200,
	'usuarios_equipo': 200,

	'encuentros': 500,
	'ganadores': 200
}

let metodos = [
	faker.lorem.word(),
	faker.lorem.word(),
	faker.lorem.word(),
	faker.lorem.word(),
	faker.lorem.word()
];

/* const collections = fs.readdirSync('./collection_ids/');
for (const c of collections) {
	const collName = c.split('.')[0];
	collIds[collName] = JSON.parse(
		fs.readFileSync(`./collection_ids/${c}`, { encoding: 'utf8'})
	);
} */

console.log(JSON.stringify(collQuantities, null, 2));

const models = [
	{
		'moderadores': {
			dni: {
				category: 'string',
				ftype: 'numeric',
				type: 'string',
				args: {
					length: 10
				}
			},
			nombres: {
				category: 'person',
				ftype: 'firstName',
				type: 'string'
			},
			apellidos: {
				category: 'person',
				ftype: 'lastName',
				type: 'string'
			},
			num_cel: {
				category: 'phone',
				ftype: 'number',
				type: 'string',
				args: {
					style: 'international'
				}
			},
			pais: {
				category: 'location',
				ftype: 'country',
				type: 'string'
			},
			descr_obligacion: {
				category: 'lorem',
				ftype: 'paragraph',
				type: 'string'
			}
		},
		'productos': {
			vendedor: {
				category: 'music',
				ftype: 'songName',
				type: 'string'
			},
			nombre: {
				category: 'book',
				ftype: 'title',
				type: 'string',
			},
			valor: {
				category: 'number',
				ftype: 'int',
				type: 'number',
				args: {
					max: 40000
				}
			},
			descuento: {
				category: 'number',
				ftype: 'int',
				type: 'number',
				args: {
					max: 40
				},
				default: 0
			}
		},
		'usuarios': {
			correo: {
				category: 'internet',
				ftype: 'email',
				type: 'string'
			},
			contrasenia: {
				category: 'string',
				ftype: 'hexadecimal',
				type: 'string',
				args: {
					length: 32,
					prefix: '',
					casing: 'lower'
				}
			},
			edad: {
				category: 'number',
				ftype: 'int',
				type: 'number',
				args: {
					min: 13,
					max: 40
				}
			},
			apodo: {
				category: 'internet',
				ftype: 'username',
				type: 'string',
				nullable: true
			},
			saldo: {
				category: 'number',
				ftype: 'int',
				type: 'number',
				args: {
					max: 100000
				},
				default: 0
			},
			pais: {
				category: 'location',
				ftype: 'country',
				type: 'string',
				nullable: true
			},
			num_cel: {
				category: 'phone',
				ftype: 'number',
				type: 'string',
				args: {
					style: 'international'
				},
				nullable: true
			}
		}
	},
	{
		'adjuntos': {
			nombre: {
				category: 'system',
				ftype: 'fileName',
				args: {
					extensionCount: 0
				},
				type: 'string'
			},
			extension: {
				category: 'system',
				ftype: 'fileExt',
				args: 'image/png',
				type: 'string'
			},
			url: {
				category: 'image',
				ftype: 'urlPicsumPhotos',
				type: 'string'
			},
			texto_alterno: {
				category: 'lorem',
				ftype: 'paragraph',
				args: {
					max: 3
				},
				nullable: true,
				type: 'string'
			},
			id_producto: {
				collName: 'productos'
			}
		},
		'amistades': {
			id_usr_emisor: {
				collName: 'usuarios'
			},
			id_usr_receptor: {
				collName: 'usuarios'
			},
			tipo: {
				category: 'string',
				ftype: 'fromCharacters',
				args: [
					'SOLICITADA',
					'ACEPTADA',
					'RECHAZADA',
					'DESAGREGADA'
				],
				type: 'string'
			},
			fecha: {
				category: 'date',
				ftype: 'past',
				type: 'string',
				args: {
					years: 5
				},
				isDate: true
			}
		},
		'cambios_divisa': {
			id_usuario: {
				collName: 'usuarios'
			},
			usd_pagado: {
				category: 'number',
				ftype: 'int',
				args: {
					min: 10,
					max: 200
				},
				type: 'number'
			},
			creditos_recib: {
				category: 'number',
				ftype: 'int',
				args: {
					min: 7000,
					max: 7000000
				},
				type: 'number'
			},
			metodo: {
				category: 'string',
				ftype: 'fromCharacters',
				args: metodos,
				type: 'string'
			},
			fecha: {
				category: 'date',
				ftype: 'past',
				type: 'string',
				args: {
					years: 5
				},
				isDate: true
			}
		},
		'carritos': {
			id_usuario: {
				collName: 'usuarios'
			},
			valor_total: {
				category: 'number',
				ftype: 'int',
				args: {
					min: 7000,
					max: 7000000
				}
			},
			fecha_compra: {
				category: 'date',
				ftype: 'past',
				type: 'string',
				args: {
					years: 5
				},
				isDate: true
			}
		},
		'equipos': {
			id_duenio: {
				collName: 'usuarios'
			},
			nombre: {
				category: 'music',
				ftype: 'songName',
				type: 'string'
			},
			descr: {
				category: 'lorem',
				ftype: 'paragraph',
				type: 'string'
			},
			fecha_creacion: {
				category: 'date',
				ftype: 'past',
				type: 'string',
				args: {
					years: 5
				},
				isDate: true
			}
		},
		'juegos': {
			id_producto: {
				collName: 'productos'
			},
			genero: {
				category: 'book',
				ftype: 'genre',
				type: 'string'
			},
			esrb: {
				category: 'string',
				ftype: 'fromCharacters',
				args: [
					'E',
					'E10+',
					'T',
					'M17+',
					'AO18+'
				],
				type: 'string'
			}
		},
		'salas': {
			nombre: {
				category: 'lorem',
				ftype: 'words',
				type: 'string'
			},
			descr: {
				category: 'lorem',
				ftype: 'paragraph',
				type: 'string'
			}
		},
		'torneos': {
			id_eq_organizador: {
				collName: 'equipos'
			},
			nombre: {
				category: 'lorem',
				ftype: 'words',
				type: 'string'
			},
			descr: {
				category: 'lorem',
				ftype: 'paragraphs',
				args: {
					min: 0,
					max: 5
				},
				type: 'string',
			},
			cuota: {
				category: 'number',
				ftype: 'int',
				args: {
					min: 7000,
					max: 7000000
				},
				type: 'number'
			},
			tipo_elim: {
				category: 'string',
				ftype: 'fromCharacters',
				args: [
					'ELIMINACIÓN DIRECTA',
					'ELIMINACIÓN DOBLE',
					'TODOS CONTRA TODOS',
					'ETAPA DE GRUPOS'
				],
				type: 'string'
			},
			fecha_publ: {
				category: 'date',
				ftype: 'past',
				type: 'string',
				args: {
					years: 5
				},
				isDate: true
			},
			fecha_inicio: {
				category: 'date',
				ftype: 'past',
				type: 'string',
				args: {
					years: 5
				},
				isDate: true
			},
			fecha_fin: {
				category: 'date',
				ftype: 'past',
				type: 'string',
				args: {
					years: 5
				},
				isDate: true
			}
		},
	},
	{
		'expansiones': {
			id_producto: {
				collName: 'productos'
			},
			id_juego: {
				collName: 'juegos'
			},
			tipo: {
				category: 'string',
				ftype: 'fromCharacters',
				args: [
					'DLC',
					'OST',
					'COSMÉTICO',
					'OTRO'
				],
				type: 'string'
			}
		},
		'participantes': {
			id_torneo: {
				collName: 'torneos'
			},
			id_equipo: {
				collName: 'equipos'
			},
			fecha: {
				category: 'date',
				ftype: 'past',
				type: 'string',
				args: {
					years: 5
				},
				isDate: true
			},
			estado: {
				category: 'string',
				ftype: 'fromCharacters',
				args: [
					'INSCRITO',
					'HIZO CHECK-IN',
					'JUGANDO',
					'ELIMINADO',
					'DESCALIFICADO'
				],
				type: 'string'
			}
		},
		'mensajes': {
			id_sala: {
				collName: 'salas'
			},
			id_usuario: {
				collName: 'usuarios'
			},
			contenido: {
				category: 'lorem',
				ftype: 'text',
				type: 'string'
			},
			fecha: {
				category: 'date',
				ftype: 'past',
				type: 'string',
				args: {
					years: 5
				},
				isDate: true
			}
		},
		'premios': {
			id_torneo: {
				collName: 'torneos'
			},
			id_producto: {
				collName: 'productos'
			},
			cantidad: {
				category: 'number',
				ftype: 'int',
				args: {
					min: 1,
					max: 10
				},
				type: 'number'
			}
		},
		'productos_carrito': {
			id_carrito: {
				collName: 'carritos'
			},
			id_producto: {
				collName: 'productos'
			},
			fecha_agreg: {
				category: 'date',
				ftype: 'past',
				type: 'string',
				args: {
					years: 5
				},
				isDate: true
			},
			valor_al_comprar: {
				category: 'number',
				ftype: 'int',
				args: {
					min: 10000,
					max: 10000000,
					multipleOf: 100
				},
				type: 'number'
			}
		},
		'resenias': {
			id_producto: {
				collName: 'productos'
			},
			id_usuario: {
				collName: 'usuarios'
			},
			contenido: {
				category: 'lorem',
				ftype: 'text',
				type: 'string'
			},
			estrellas: {
				category: 'number',
				ftype: 'int',
				args: {
					min: 0,
					max: 5,
				},
				type: 'number'
			},
			fecha: {
				category: 'date',
				ftype: 'past',
				type: 'string',
				args: {
					years: 5
				},
				isDate: true
			}
		},
		'tiquetes': {
			id_usuario: {
				collName: 'usuarios'
			},
			id_moderador: {
				collName: 'moderadores'
			},
			asunto: {
				category: 'lorem',
				ftype: 'sentence',
				args: {
					max: 15
				},
				type: 'string'
			},
			contenido: {
				category: 'lorem',
				ftype: 'text',
				type: 'string'
			},
			fecha: {
				category: 'date',
				ftype: 'past',
				type: 'string',
				args: {
					years: 5
				},
				isDate: true
			},
			estado: {
				category: 'string',
				ftype: 'fromCharacters',
				args: [
					'PENDIENTE',
					'EN PROCESO',
					'ATENDIDO'
				],
				type: 'string'
			}
		},
		'usuarios_equipo': {
			id_equipo: {
				collName: 'equipos'
			},
			id_usuario: {
				collName: 'usuarios'
			},
			fecha_ingr: {
				category: 'date',
				ftype: 'past',
				type: 'string',
				args: {
					years: 5
				},
				isDate: true
			}
		},
	},
	{
		'encuentros': {
			id_torneo: {
				collName: 'torneos'
			},
			id_particip1: {
				collName: 'participantes'
			},
			id_particip2: {
				collName: 'participantes'
			},
			puntos1: {
				category: 'number',
				ftype: 'int',
				args: {
					min: 0,
					max: 10
				},
				type: 'number'
			},
			puntos2: {
				category: 'number',
				ftype: 'int',
				args: {
					min: 0,
					max: 10
				},
				type: 'number'
			},
			fecha: {
				category: 'date',
				ftype: 'past',
				type: 'string',
				args: {
					years: 5
				},
				isDate: true
			}
		},
		'ganadores': {
			id_particip: {
				collName: 'participantes'
			},
			id_premio: {
				collName: 'premios'
			}
		},
	}
]


function generateEntries(collection, quantity) {
	const model = models[3][collection]
	
	const data = [];
	for (let i = 0; i < quantity; i++) {
		let entry = {}
		for (const columnName in model) {
			const column = model[columnName];
			if (!column.collName) {
				if (column.nullable) {
					entry[columnName] = faker.helpers.maybe(() => {
						return faker[column.category][column.ftype].call(null, column.args)
					}, {probability: 0.7});
					if (
						typeof entry[columnName] === 'undefined' &&
						column.default !== 'undefined'
					) {
						entry[columnName] = faker.helpers.maybe(() => {
							return column.default;
						}, {probability: 0.6});
					}
					if (typeof entry[columnName] === 'undefined') {
						entry[columnName] = null;
					}
				} else {
					entry[columnName] = faker[column.category][column.ftype].call(
						null, column.args
					)
				}
			} else {
				entry[columnName] = Math.ceil(collQuantities[column.collName] * Math.random())
			}
		}

		data.push(entry);
	}

	return data;
}

for (const collName in models[3]) {
	const entries = generateEntries(collName, collQuantities[collName]);
	fs.writeFileSync(
		`./output/MQL/${collName}.json`, JSON.stringify(entries, null, 2)
	);

	let sql = '';
	for (const entry of entries) {
		let numCols = Object.keys(entry).length;

		sql += `INSERT INTO ${collName.toUpperCase()} (${
			Object.keys(entry).join(', ')
		}) VALUES (`;
		for (const key in entry) {
			numCols--;
			if (entry[key] !== null) {
				if (models[3][collName][key]['isDate']) {
					sql += 'STR_TO_DATE("';
				} else if (models[3][collName][key]['type'] === 'string') {
					sql += '"';
				}
			}
			sql += entry[key];
			if (entry[key] !== null) {
				if (models[3][collName][key]['isDate']) {
					sql += '", "%a %b %d %Y %T GMT-0500 (hora estándar de Colombia)")';
				} else if (models[3][collName][key]['type'] === 'string') {
					sql += '"';
				}
			}
			if (numCols > 0) {
				sql += ', ';
			}
		}
		sql += `);\n`;
	}
	fs.writeFileSync(`./output/SQL/INSERT ${collName.toUpperCase()}.sql`, sql);
}