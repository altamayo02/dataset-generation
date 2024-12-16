const { fakerES_MX } = require('@faker-js/faker');
let faker = fakerES_MX;
const fs = require('fs');

let mongoIds = {}
const collections = fs.readdirSync('./collection_ids/');
for (const c of collections) {
	const collName = c.split('.')[0];
	mongoIds[collName] = JSON.parse(
		fs.readFileSync(`./collection_ids/${c}`, { encoding: 'utf8'})
	);
}

console.log(JSON.stringify(mongoIds, null, 2));

const models = {
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
	/* 'adjuntos': {
		nombre: {
			category: 'system',
			ftype: 'fileName',
			args: {
				extensionCount: 0
			}
		},
		extension: {
			category: 'system',
			ftype: 'fileExt',
			args: 'image'
		},
		url: {
			category: 'image',
			ftype: 'urlPicsumPhotos'
		},
		texto_alterno: {
			category: 'lorem',
			ftype: 'paragraph',
			args: {
				max: 3
			},
			nullable: true
		},
		id_producto: {
			mongoColl: 'productos'
		}
	} */
}


function generateEntries(collection, quantity) {
	const model = models[collection]
	
	const data = [];
	for (let i = 0; i < quantity; i++) {
		let entry = {}
		for (const columnName in model) {
			const column = model[columnName];
			if (!column.mongoColl) {
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
				const ids = mongoIds[column.mongoColl];
				entry[columnName] = ids[Math.floor(ids.length * Math.random())]
			}
		}

		data.push(entry);
	}

	return data;
}

for (const collName in models) {
	const entries = generateEntries(collName, 1000);
	fs.writeFileSync(
		`./output/MQL/${collName}.json`, JSON.stringify(entries, null, 2)
	);

	let sql = '';
	for (const entry of entries) {
		let numCols = Object.keys(entry).length;

		sql += `INSERT INTO ${collName.toUpperCase()} VALUES (`
		for (const key in entry) {
			numCols--;
			if (
				models[collName][key]['type'] === 'string' &&
				entry[key] !== null
			) sql += '"';
			sql += entry[key];
			if (
				models[collName][key]['type'] === 'string' &&
				entry[key] !== null
			) sql += '"';
			if (numCols > 0) {
				sql += ', ';
			}
		}
		sql += `);\n`;
	}
	fs.writeFileSync(`./output/SQL/${collName.toUpperCase()} INSERT.sql`, sql);
}