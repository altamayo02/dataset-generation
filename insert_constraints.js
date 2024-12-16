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
    result = insertConsistent[changeEvent.ns.coll](changeEvent.fullDocument);
  } catch(err) {
    console.log(`Error occurred while attempting to insert.\n${err.message}`);
    return { error: err.message };
  }
  return {
    message: 'Operation completed.',
    result: result
  }
};

insertConsistent = {
  adjuntos: (entries) => {
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
    
    for (const adjunto of entries) {
      let valid = true;
      for (const column in constraints) {
        if (!isValidValue(constraints, adjunto, column)) {
          valid = false;
          break;
        }
      }
      if (!valid) continue;

      // FKs
      let query = context.services.get('Cluster0').db('gaemon').collection('productos').aggregate([
        {
          $match: {
            _id: adjunto['id_producto']
          }
        }
      ]);
      if (query.length == 0) {
        console.log(adjunto);
        console.log(`id_producto ${id_producto} does not exist.`);
      }

      // Insertion
      context.services.get('Cluster0').db('gaemon').collection('productos').updateOne(
        {
          _id: adjunto['id_producto']
        },
        {
          $push: {
            adjuntos: adjunto
          }
        }
      )
    }
  },
  amistades: (entries) => {

  },
  cambios_divisa: (entries) => {

  },
  carrito: (entries) => {

  },
  encuentros: (entries) => {

  },
  equipos: (entries) => {

  },
  expansiones: (entries) => {

  },
  ganadores: (entries) => {

  },
  juegos: (entries) => {

  },
  mensajes: (entries) => {

  },
  moderadores: (entries) => {

  },
  participantes: (entries) => {

  },
  premios: (entries) => {

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
    
    for (const producto of entries) {
      let valid = true;
      for (const column in constraints) {
        if (!isValidValue(constraints, producto, column)) {
          valid = false;
          break;
        }
      }
      if (!valid) continue;

      // FKs
      let query = context.services.get('Cluster0').db('gaemon').collection('productos').aggregate([
        {
          $match: {
            _id: producto['id_producto']
          }
        }
      ]);
      if (query.length == 0) {
        console.log(producto);
        console.log(`id_producto ${id_producto} does not exist.`);
      }

      // CHKs
      if (!(producto['descuento'] >= 0 && producto['descuento'] <= 100)) {
        console.log(producto);
        console.log('Attribute descuento must be between 0 and 100.');
        continue;
      }

      // Insertion
      context.services.get('Cluster0').db('gaemon').collection('productos').insertOne(producto);
    }
  },
  productos_carrito: (entries) => {

  },
  resenias: (entries) => {

  },
  salas: (entries) => {

  },
  tiquetes: (entries) => {

  },
  torneos: (entries) => {

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
    
    for (const usuario of entries) {
      let valid = true;
      for (const column in constraints) {
        if (!isValidValue(constraints, usuario, column)) {
          valid = false;
          break;
        }
      }
      if (!valid) continue;

      // CHKs
      if (!(usuario['edad'] >= 13)) {
        console.log(usuario);
        console.log('Attribute edad must be greater than 13.');
        continue;
      }
      if (!(usuario['saldo'] >= 0)) {
        console.log(usuario);
        console.log('Attribute saldo must be greater than 0.');
        continue;
      }


      // Insertion
      context.services.get('Cluster0').db('gaemon').collection('usuarios').insertOne(usuario);
    }
  },
  usuarios_equipo: (entries) => {

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

function isValidValue(constraints, entry, column) {
  // Validate default and nullable
  if (!isNullComplying(constraints[column], entry[column])) {
    console.log(JSON.stringify(entry, null, 2));
    console.log(`Attribute ${column} cannot be null.`);
    return false;
  }

  // Validate data type
  if (typeof entry[column] !== constraints[column]['type']) {
    console.log(JSON.stringify(entry, null, 2));
    console.log(
      `Attribute ${column} must be of type ${constraints[column]['type']}.`
    );
    return false;
  }

  // Validate data length
  if (
    (typeof value === 'number' || typeof value === 'string') &&
    value.toString().length > constraints[column]['length']
  ) {
    console.log(JSON.stringify(entry, null, 2));
    console.log(
      `Maximum length for attribute ${column} is ${constraints[column]['length']}.`
    );
    return false;
  }

  return true;
}