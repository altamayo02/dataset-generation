exports = async function(changeEvent) {
  /*
  changeEvent.ns.coll = 'usuarios'
  changeEvent.fullDocument = [{
    correo: 'bromita@fakemail.com',
    contrasenia: 'a1cb55de8a897b45c536b5a123d5f876',
    edad: 22,
    apodo: 'El Bromero',
    saldo: 136854680,
    pais: 'Colombia',
    num_cel: 301234567
  }]
  */
	let result;
  try {
		result = validateDoc[changeEvent.ns.coll](changeEvent.fullDocument);
		if (result.status == 'failed') {
			context.services.get('Cluster0').db('entregaFinal').collection(
				changeEvent.ns.coll
			).deleteOne({
				_id: changeEvent.documentKey._id
			})
		}
  } catch(err) {
		context.services.get('Cluster0').db('entregaFinal').collection(
			changeEvent.ns.coll
		).deleteOne({
			_id: changeEvent.documentKey._id
		})
    return {
			document: changeEvent.fullDocument,
			message: 'Error occurred while attempting to insert.',
			status: 'failed',
			error: err.message
		};
  }
  return result;
};

//const constraints = {}

const validateDoc = {
  adjuntos: (adjunto) => {
    let constraints = {
      nombre: {
        type: 'string',
        length: 50
      },
      extension: {
        type: 'string',
        length: 20
      },
      url: {
        type: 'string'
      },
      texto_alterno: {
        type: 'string',
        length: 200,
        nullable: true
      },
      id_producto: {}
    }

		let result;
		for (const column in constraints) {
			result = isValidValue(constraints, adjunto, column);
			if (result.status == 'failed') break;
		}
		if (result.status == 'failed') return result;

		// FKs
		let query = context.services.get('Cluster0').db('entregaFinal').collection('productos').aggregate([
			{
				$match: {
					_id: adjunto['id_producto']
				}
			}
		]);
		if (query.length == 0) {
			result.status = 'failed';
			result.message = `id_producto ${id_producto} does not exist.`;
			return result;
		}

		// Insertion
		context.services.get('Cluster0').db('entregaFinal').collection('productos').updateOne(
			{
				_id: adjunto['id_producto']
			},
			{
				$push: {
					adjuntos: adjunto
				}
			}
		)
  },
  amistades: (entries) => {
		let constraints = {
			id_usr_emisor: {},
			id_usr_receptor: {},
			fecha: {
				type: 'string',
				isDate: true
			},
			tipo: {
				type: 'string',
				length: 50
			}
		}

		let result;
		for (const column in constraints) {
			result = isValidValue(constraints, amistad, column);
			if (result.status == 'failed') break;
		}
		if (result.status == 'failed') return result;

		// FKs
		let queryEmisor = context.services('Cluster0').db('entregaFinal').collection('usuarios').aggregate([
			{
					$match: {
							_id: amistad['id_usr_emisor']
					}
			}
		]);
		if (queryEmisor.length == 0) {
			console.log(amistad);
			console.log(`id_usr_emisor ${amistad['id_usr_emisor']} does not exist.`);
		}

		let queryReceptor = context.services('Cluster0').db('entregaFinal').collection('usuarios').aggregate([
			{
					$match: {
							_id: amistad['id_usr_receptor']
					}
			}
		]);
		if (queryReceptor.length == 0) {
			console.log(amistad);
			console.log(`id_usr_receptor ${amistad['id_usr_receptor']} does not exist.`);
		}

		// Insertion
		context.services('Cluster0').db('entregaFinal').collection('usuarios').updateOne(
			{
					_id: amistad['id_usr_emisor']
			},
			{
					$push: {
							amistades: amistad
					}
			}
		);
	},
  cambios_divisa: (entries) => {
		let constraints = {
			id_usuario: {},
			usd_pagado: {
				type: 'number'
			},
			creditos_recib: {
				type: 'number'
			},
			metodo: {
				type: 'string',
				length: 50
			},
			fecha: {
				type: 'string',
				isDate: true
			}
		}

		let result;
		for (const column in constraints) {
			result = isValidValue(constraints, cambioDivisa, column);
			if (result.status == 'failed') break;
		}
		if (result.status == 'failed') return result;

		// FKs
		let queryUsuario = context.services('Cluster0').db('entregaFinal').collection('usuarios').aggregate([
			{
					$match: {
							_id: cambioDivisa['id_usuario']
					}
			}
		]);
		if (queryUsuario.length == 0) {
			console.log(cambioDivisa);
			console.log(`id_usuario ${cambioDivisa['id_usuario']} does not exist.`);
		}

		// Insertion
		context.services('Cluster0').db('entregaFinal').collection('usuarios').updateOne(
			{
					_id: cambioDivisa['id_usuario']
			},
			{
					$push: {
							cambiosDivisa: cambioDivisa
					}
			}
		);
	},
  carritos: (entries) => {
    let constraints = {
			id_usuario: {},
			valor_total: {
				type: 'number'
			},
			fecha_compra: {
				type: 'string',
				isDate: true
			}
		}

		let result;
		for (const column in constraints) {
			result = isValidValue(constraints, carrito, column);
			if (result.status == 'failed') break;
		}
		if (result.status == 'failed') return result;

		// FKs
		let query = context.services('Cluster0').db('entregaFinal').collection('usuarios').aggregate([
			{
					$match: {
							_id: carrito['id_usuario']
					}
			}
		]);
		if (query.length == 0) {
			result.status = 'failed';
			result.message = `id_usuario ${carrito['id_usuario']} does not exist.`;
			return result;
		}

		// Insertion
		context.services('Cluster0').db('entregaFinal').collection('usuarios').updateOne(
			{
					_id: carrito['id_usuario']
			},
			{
					$push: {
							carritos: carrito
					}
			}
		);
	},
  encuentros: (entries) => {
    let constraints = {
			id_torneo: {},
			id_particip1: {},
			id_particip2: {},
			puntos1: {
				type: 'number'
			},
			puntos2: {
				type: 'number'
			},
			fecha: {
				type: 'string',
				isDate: true
			}
		}

		let result;
		for (const column in constraints) {
			result = isValidValue(constraints, encuentro, column);
			if (result.status == 'failed') break;
		}
		if (result.status == 'failed') return result;

		// FKs
		let queryTorneo = context.services('Cluster0').db('entregaFinal').collection('torneos').aggregate([
			{
					$match: {
							_id: encuentro['id_torneo']
					}
			}
		]);
		if (queryTorneo.length == 0) {
			console.log(encuentro);
			console.log(`id_torneo ${encuentro['id_torneo']} does not exist.`);
		}

		let queryParticip1 = context.services('Cluster0').db('entregaFinal').collection('participantes').aggregate([
			{
					$match: {
							_id: encuentro['id_particip1']
					}
			}
		]);
		if (queryParticip1.length == 0) {
			console.log(encuentro);
			console.log(`id_particip1 ${encuentro['id_particip1']} does not exist.`);
		}

		let queryParticip2 = context.services('Cluster0').db('entregaFinal').collection('participantes').aggregate([
			{
					$match: {
							_id: encuentro['id_particip2']
					}
			}
		]);
		if (queryParticip2.length == 0) {
			console.log(encuentro);
			console.log(`id_particip2 ${encuentro['id_particip2']} does not exist.`);
		}

		// Insertion
		context.services('Cluster0').db('entregaFinal').collection('torneos').updateOne(
			{
					_id: encuentro['id_torneo']
			},
			{
					$push: {
							encuentros: encuentro
					}
			}
		);
	},
  equipos: (entries) => {
    let constraints = {
			id_duenio: {},
			nombre: {
				type: 'string',
				length: 255
			},
			descr: {
				type: 'string'
			},
			fecha_creacion: {
				type: 'string',
				isDate: true
			}
		}

		let result;
		for (const column in constraints) {
			result = isValidValue(constraints, equipo, column);
			if (result.status == 'failed') break;
		}
		if (result.status == 'failed') return result;

		// FKs
		let queryDuenio = context.services('Cluster0').db('entregaFinal').collection('usuarios').aggregate([
			{
					$match: {
							_id: equipo['id_duenio']
					}
			}
		]);
		if (queryDuenio.length == 0) {
			console.log(equipo);
			console.log(`id_duenio ${equipo['id_duenio']} does not exist.`);
		}

		// Insertion
		context.services('Cluster0').db('entregaFinal').collection('usuarios').updateOne(
			{
					_id: equipo['id_duenio']
			},
			{
					$push: {
							equipos: equipo
					}
			}
		);
	},
  expansiones: (entries) => {
    let constraints = {
			id_producto: {},
			id_juego: {},
			tipo: {
				type: 'string',
				length: 50
			}
		}

		let result;
		for (const column in constraints) {
			result = isValidValue(constraints, expansion, column);
			if (result.status == 'failed') break;
		}
		if (result.status == 'failed') return result;

		// FKs
		let queryProducto = context.services('Cluster0').db('entregaFinal').collection('productos').aggregate([
			{
					$match: {
							_id: expansion['id_producto']
					}
			}
		]);
		if (queryProducto.length == 0) {
			console.log(expansion);
			console.log(`id_producto ${expansion['id_producto']} does not exist.`);
		}

		let queryJuego = context.services('Cluster0').db('entregaFinal').collection('juegos').aggregate([
			{
					$match: {
							_id: expansion['id_juego']
					}
			}
		]);
		if (queryJuego.length == 0) {
			console.log(expansion);
			console.log(`id_juego ${expansion['id_juego']} does not exist.`);
		}

		// Insertion
		context.services('Cluster0').db('entregaFinal').collection('productos').updateOne(
			{
					_id: expansion['id_producto']
			},
			{
					$push: {
							expansiones: expansion
					}
			}
		);
	},
  ganadores: (entries) => {
    let constraints = {
			id_particip: {},
			id_premio: {},
			fecha: {
				type: 'string',
				isDate: true
			}
		}

		let result;
		for (const column in constraints) {
			result = isValidValue(constraints, ganador, column);
			if (result.status == 'failed') break;
		}
		if (result.status == 'failed') return result;

		// FKs
		let queryParticipante = context.services('Cluster0').db('entregaFinal').collection('participantes').aggregate([
			{
					$match: {
							_id: ganador['id_particip']
					}
			}
		]);
		if (queryParticipante.length == 0) {
			console.log(ganador);
			console.log(`id_particip ${ganador['id_particip']} does not exist.`);
		}

		let queryPremio = context.services('Cluster0').db('entregaFinal').collection('premios').aggregate([
			{
					$match: {
							id_torneo: ganador['id_premio'].id_torneo,
							id_producto: ganador['id_premio'].id_producto
					}
			}
		]);
		if (queryPremio.length == 0) {
			console.log(ganador);
			console.log(`id_premio ${ganador['id_premio']} does not exist.`);
		}

		// Insertion
		context.services('Cluster0').db('entregaFinal').collection('participantes').updateOne(
			{
					_id: ganador['id_particip']
			},
			{
					$push: {
							ganadores: ganador
					}
			}
		);
	},
  juegos: (entries) => {
    let constraints = {
			id_producto: {},
			genero: {
				type: 'string',
				length: 50
			},
			esrb: {
				type: 'string',
				length: 10
			}
		}

		let result;
		for (const column in constraints) {
			result = isValidValue(constraints, juego, column);
			if (result.status == 'failed') break;
		}
		if (result.status == 'failed') return result;

		// FKs
		let queryProducto = context.services('Cluster0').db('entregaFinal').collection('productos').aggregate([
			{
					$match: {
							_id: juego['id_producto']
					}
			}
		]);
		if (queryProducto.length == 0) {
			console.log(juego);
			console.log(`id_producto ${juego['id_producto']} does not exist.`);
		}

		// Insertion
		context.services('Cluster0').db('entregaFinal').collection('productos').updateOne(
			{
					_id: juego['id_producto']
			},
			{
					$set: {
							juego: juego
					}
			}
		);
	},
  mensajes: (entries) => {
    let constraints = {
			id_sala: {},
			id_usuario: {},
			contenido: {
				type: 'string'
			},
			fecha: {
				type: 'string',
				isDate: true
			}
		}

		let result;
		for (const column in constraints) {
			result = isValidValue(constraints, mensaje, column);
			if (result.status == 'failed') break;
		}
		if (result.status == 'failed') return result;

		// FKs
		let querySala = context.services('Cluster0').db('entregaFinal').collection('salas').aggregate([
			{
					$match: {
							_id: mensaje['id_sala']
					}
			}
		]);
		if (querySala.length == 0) {
			console.log(mensaje);
			console.log(`id_sala ${mensaje['id_sala']} does not exist.`);
		}

		let queryUsuario = context.services('Cluster0').db('entregaFinal').collection('usuarios').aggregate([
			{
					$match: {
							_id: mensaje['id_usuario']
					}
			}
		]);
		if (queryUsuario.length == 0) {
			console.log(mensaje);
			console.log(`id_usuario ${mensaje['id_usuario']} does not exist.`);
		}

		// Insertion
		context.services('Cluster0').db('entregaFinal').collection('salas').updateOne(
			{
					_id: mensaje['id_sala']
			},
			{
					$push: {
							mensajes: mensaje
					}
			}
		);
	},
  moderadores: (entries) => {
    let constraints = {
			dni: {
				type: 'string',
				length: 20
			},
			nombres: {
				type: 'string',
				length: 255
			},
			apellidos: {
				type: 'string',
				length: 255
			},
			num_cel: {
				type: 'string',
				length: 20
			},
			pais: {
				type: 'string',
				length: 255
			},
			descr_obligacion: {
				type: 'string'
			}
		}

		let result;
		for (const column in constraints) {
			result = isValidValue(constraints, moderador, column);
			if (result.status == 'failed') break;
		}
		if (result.status == 'failed') return result;

		// Insertion
		context.services('Cluster0').db('entregaFinal').collection('moderadores').insertOne({
			dni: moderador['dni'],
			nombres: moderador['nombres'],
			apellidos: moderador['apellidos'],
			num_cel: moderador['num_cel'],
			pais: moderador['pais'],
			descr_obligacion: moderador['descr_obligacion']
		});
	},
  participantes: (entries) => {
    let constraints = {
			id_torneo: {},
			id_usrs_eq: {},
			fecha: {
				type: 'string',
				isDate: true
			},
			estado: {
				type: 'string',
				length: 50
			}
		}

		let result;
		for (const column in constraints) {
			result = isValidValue(constraints, participante, column);
			if (result.status == 'failed') break;
		}
		if (result.status == 'failed') return result;

		// FKs
		let queryTorneo = context.services('Cluster0').db('entregaFinal').collection('torneos').aggregate([
			{
					$match: {
							_id: participante['id_torneo']
					}
			}
		]);
		if (queryTorneo.length == 0) {
			console.log(participante);
			console.log(`id_torneo ${participante['id_torneo']} does not exist.`);
		}

		let queryUsuario = context.services('Cluster0').db('entregaFinal').collection('usuarios').aggregate([
			{
					$match: {
							_id: participante['id_usrs_eq']
					}
			}
		]);
		if (queryUsuario.length == 0) {
			console.log(participante);
			console.log(`id_usrs_eq ${participante['id_usrs_eq']} does not exist.`);
		}

		// Insertion
		context.services('Cluster0').db('entregaFinal').collection('torneos').updateOne(
			{
					_id: participante['id_torneo']
			},
			{
					$push: {
							participantes: participante
					}
			}
		);
	},
  premios: (entries) => {
    let constraints = {
			id_torneo: {},
			id_producto: {},
			cantidad: {
				type: 'number',
				min: 1
			}
		}

		let result;
		for (const column in constraints) {
			result = isValidValue(constraints, premio, column);
			if (result.status == 'failed') break;
		}
		if (result.status == 'failed') return result;

		// FKs
		let queryTorneo = context.services('Cluster0').db('entregaFinal').collection('torneos').aggregate([
			{
					$match: {
							_id: premio['id_torneo']
					}
			}
		]);
		if (queryTorneo.length == 0) {
			console.log(premio);
			console.log(`id_torneo ${premio['id_torneo']} does not exist.`);
		}

		let queryProducto = context.services('Cluster0').db('entregaFinal').collection('productos').aggregate([
			{
					$match: {
							_id: premio['id_producto']
					}
			}
		]);
		if (queryProducto.length == 0) {
			console.log(premio);
			console.log(`id_producto ${premio['id_producto']} does not exist.`);
		}

		// Insertion
		context.services('Cluster0').db('entregaFinal').collection('premios').insertOne({
			id_torneo: premio['id_torneo'],
			id_producto: premio['id_producto'],
			cantidad: premio['cantidad']
		});
	},
  productos: (entries) => {
    let constraints = {
      vendedor: {
        type: 'string',
        length: 50
      },
      nombre: {
        type: 'string',
        length: 50
      },
      valor: {
        type: 'number',
      },
      descuento: {
        type: 'string',
        length: 200,
        default: 0
      }
    }

		let result;
		for (const column in constraints) {
			result = isValidValue(constraints, producto, column);
			if (result.status == 'failed') break;
		}
		if (result.status == 'failed') return result;

		// CHKs
		if (!(producto['descuento'] >= 0 && producto['descuento'] <= 100)) return {
			document: producto,
			message: 'Attribute descuento must be between 0 and 100.',
			status: 'failed'
		}

		// Insertion
		context.services.get('Cluster0').db('entregaFinal').collection('productos').insertOne(producto);
  },
  productos_carrito: (entries) => {
    let constraints = {
			id_carrito: {},
			id_producto: {},
			fecha_agreg: {
				type: 'string',
				isDate: true
			},
			valor_al_comprar: {
				type: 'number',
				min: 0
			}
		}

		let result;
		for (const column in constraints) {
			result = isValidValue(constraints, productoCarrito, column);
			if (result.status == 'failed') break;
		}
		if (result.status == 'failed') return result;

		// FKs
		let queryCarrito = context.services('Cluster0').db('entregaFinal').collection('carritos').aggregate([
			{
					$match: {
							_id: productoCarrito['id_carrito']
					}
			}
		]);
		if (queryCarrito.length == 0) {
			console.log(productoCarrito);
			console.log(`id_carrito ${productoCarrito['id_carrito']} does not exist.`);
		}

		let queryProducto = context.services('Cluster0').db('entregaFinal').collection('productos').aggregate([
			{
					$match: {
							_id: productoCarrito['id_producto']
					}
			}
		]);
		if (queryProducto.length == 0) {
			console.log(productoCarrito);
			console.log(`id_producto ${productoCarrito['id_producto']} does not exist.`);
		}

		// Insertion
		context.services('Cluster0').db('entregaFinal').collection('carritos').updateOne(
			{
					_id: productoCarrito['id_carrito']
			},
			{
					$push: {
							productosCarrito: productoCarrito
					}
			}
		);
	},
  resenias: (entries) => {
    let constraints = {
			id_producto: {},
			id_usuario: {},
			contenido: {
				type: 'string'
			},
			estrellas: {
				type: 'number',
				min: 1,
				max: 5
			},
			fecha: {
				type: 'string',
				isDate: true
			}
		}

		let result;
		for (const column in constraints) {
			result = isValidValue(constraints, resenia, column);
			if (result.status == 'failed') break;
		}
		if (result.status == 'failed') return result;

		// FKs
		let query = context.services('Cluster0').db('entregaFinal').collection('productos').aggregate([
			{
					$match: {
							_id: resenia['id_producto']
					}
			}
		]);
		if (query.length == 0) {
			result.status = 'failed';
			result.message = `id_producto ${resenia['id_producto']} does not exist.`;
			return result;
		}

		let queryUser = context.services('Cluster0').db('entregaFinal').collection('usuarios').aggregate([
			{
					$match: {
							_id: resenia['id_usuario']
					}
			}
		]);
		if (queryUser.length == 0) {
			console.log(resenia);
			console.log(`id_usuario ${resenia['id_usuario']} does not exist.`);
		}

		// Insertion
		context.services('Cluster0').db('entregaFinal').collection('productos').updateOne(
			{
					_id: resenia['id_producto']
			},
			{
					$push: {
							resenias: resenia
					}
			}
		);
	},
  salas: (entries) => {
    let constraints = {
			id_equipo: {},
			nombre: {
				type: 'string',
				length: 255
			},
			descr: {
				type: 'string'
			}
		}

		let result;
		for (const column in constraints) {
			result = isValidValue(constraints, sala, column);
			if (result.status == 'failed') break;
		}
		if (result.status == 'failed') return result;

		// FKs
		let queryEquipo = context.services('Cluster0').db('entregaFinal').collection('equipos').aggregate([
			{
					$match: {
							_id: sala['id_equipo']
					}
			}
		]);
		if (queryEquipo.length == 0) {
			console.log(sala);
			console.log(`id_equipo ${sala['id_equipo']} does not exist.`);
		}

		// Insertion
		context.services('Cluster0').db('entregaFinal').collection('equipos').updateOne(
			{
					_id: sala['id_equipo']
			},
			{
					$push: {
							salas: sala
					}
			}
		);
	},
  tiquetes: (entries) => {
    let constraints = {
			id_usuario: {},
			id_moderador: {},
			asunto: {
				type: 'string',
				length: 255
			},
			contenido: {
				type: 'string'
			},
			fecha: {
				type: 'string',
				isDate: true
			},
			estado: {
				type: 'string',
				length: 50
			}
		}

		let result;
		for (const column in constraints) {
			result = isValidValue(constraints, tiquete, column);
			if (result.status == 'failed') break;
		}
		if (result.status == 'failed') return result;

		// FKs
		let queryUsuario = context.services('Cluster0').db('entregaFinal').collection('usuarios').aggregate([
			{
					$match: {
							_id: tiquete['id_usuario']
					}
			}
		]);
		if (queryUsuario.length == 0) {
			console.log(tiquete);
			console.log(`id_usuario ${tiquete['id_usuario']} does not exist.`);
		}

		let queryModerador = context.services('Cluster0').db('entregaFinal').collection('moderadores').aggregate([
			{
					$match: {
							_id: tiquete['id_moderador']
					}
			}
		]);
		if (queryModerador.length == 0) {
			console.log(tiquete);
			console.log(`id_moderador ${tiquete['id_moderador']} does not exist.`);
		}

		// Insertion
		context.services('Cluster0').db('entregaFinal').collection('usuarios').updateOne(
			{
					_id: tiquete['id_usuario']
			},
			{
					$push: {
							tiquetes: tiquete
					}
			}
		);
	},
  torneos: (entries) => {
    let constraints = {
			id_eq_organizador: {},
			nombre: {
				type: 'string',
				length: 255
			},
			descr: {
				type: 'string'
			},
			cuota: {
				type: 'number',
				min: 0
			},
			tipo_elim: {
				type: 'string',
				length: 50
			},
			fecha_publ: {
				type: 'string',
				isDate: true
			},
			fecha_inicio: {
				type: 'string',
				isDate: true
			},
			fecha_fin: {
				type: 'string',
				isDate: true
			}
		}

		let result;
		for (const column in constraints) {
			result = isValidValue(constraints, torneo, column);
			if (result.status == 'failed') break;
		}
		if (result.status == 'failed') return result;

		// FKs
		let queryEquipo = context.services('Cluster0').db('entregaFinal').collection('equipos').aggregate([
			{
					$match: {
							_id: torneo['id_eq_organizador']
					}
			}
		]);
		if (queryEquipo.length == 0) {
			console.log(torneo);
			console.log(`id_eq_organizador ${torneo['id_eq_organizador']} does not exist.`);
		}

		// Insertion
		context.services('Cluster0').db('entregaFinal').collection('equipos').updateOne(
			{
					_id: torneo['id_eq_organizador']
			},
			{
					$push: {
							torneos: torneo
					}
			}
		);
	},
  usuarios: (entries) => {
    let constraints = {
      correo: {
        type: 'string',
        length: 100
      },
      contrasenia: {
        type: 'string',
        length: 32
      },
      edad: {
        type: 'number'
      },
      apodo: {
        type: 'string',
        length: 30,
        nullable: true
      },
      saldo: {
        type: 'number',
        default: 0
      },
      pais: {
        type: 'string',
        length: 50,
        nullable: true
      },
      num_cel: {
        type: 'string',
        length: 20,
        nullable: true
      }
    }

		let result;
		for (const column in constraints) {
			result = isValidValue(constraints, usuario, column);
			if (result.status == 'failed') break;
		}
		if (result.status == 'failed') return result;

		// CHKs
		if (!(usuario['edad'] >= 13)) return {
			document: usuario,
			message: 'Attribute edad must be greater than 13.',
			status: 'failed'
		}
		if (!(usuario['saldo'] >= 0)) return {
			document: usuario,
			message: 'Attribute saldo must be greater than 0.',
			status: 'failed'
		}

		// Insertion
		context.services.get('Cluster0').db('entregaFinal').collection('usuarios').insertOne(usuario);
  },
  usuarios_equipo: (entries) => {
    let constraints = {
			id_equipo: {},
			id_usuario: {},
			fecha_ingr: {
				type: 'string',
				isDate: true
			}
		}

		let result;
		for (const column in constraints) {
			result = isValidValue(constraints, usuarioEquipo, column);
			if (result.status == 'failed') break;
		}
		if (result.status == 'failed') return result;

		// FKs
		let query = context.services('Cluster0').db('entregaFinal').collection('equipos').aggregate([
			{
					$match: {
							_id: usuarioEquipo['id_equipo']
					}
			}
		]);
		if (query.length == 0) {
			result.status = 'failed';
			result.message = `id_equipo ${usuarioEquipo['id_equipo']} does not exist.`;
			return result;
		}

		// Insertion
		context.services('Cluster0').db('entregaFinal').collection('equipos').updateOne(
			{
					_id: usuarioEquipo['id_equipo']
			},
			{
					$push: {
							usuariosEquipo: usuarioEquipo
					}
			}
		);
	}
}

function isNullComplying(constraint, value) {
  // If incoming value is null
  if (typeof value === 'undefined' || typeof value === null) {
    // Column has a default value
    if (typeof constraint['default'] !== 'undefined') {
      value = constraint['default'];
    // Column is nullable
    } else if (constraint['nullable']) {
      value = null;
    // Value does not comply
    } else return false;
  }
  return true;
}

function isValidValue(constraints, doc, column) {
  // Validate default and nullable
  if (!isNullComplying(constraints[column], doc[column])) return {
		document: doc,
		message: `Attribute ${column} cannot be null.`,
		status: 'failed'
	}

  // Validate data type
  if (typeof doc[column] !== constraints[column]['type']) return {
		document: doc,
		message: `Attribute ${column} must be of type ${
			constraints[column]['type']
		}.`,
		status: 'failed'
	}

  // Validate data length
  if (
    (typeof value === 'number' || typeof value === 'string') &&
    value.toString().length > constraints[column]['length']
  ) return {
		document: doc,
		message: `Maximum length for attribute ${column} is ${
			constraints[column]['length']
		}.`,
		status: 'failed'
	}

  return {
		document: doc,
		message: `Operation successful.`,
		status: 'ok'
	};
}