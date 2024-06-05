/* 
  * Rutas de Eventos / events
  * host + /api/events
*/

const { Router } = require('express');
const { check } = require('express-validator');
const { validateJWT } = require('../middlewares/validate-jwt');
const { getEvents, createEvent, updateEvent, deleteEvent } = require('../controllers/events');
const { fieldsValidator } = require('../middlewares/fields-validator');
const { isDate } = require('../helpers/isDate');
const router = Router();

// * Todas tienen que pasar la validacion de JWT
// * Middleware
router.use(validateJWT);

// ? Obtener eventos
router.get('/', getEvents);

// ? Crear nuevo evento
router.post(
  '/',
  [
    check('title', 'El titulo es obligatorio').not().isEmpty(),
    check('start', 'Fecha de inicio es obligatorio').custom(isDate),
    check('end', 'Fecha de finalización es obligatorio').custom(isDate),
    fieldsValidator
  ],
  createEvent
);

// ? Actualizar evento
router.put('/:id', updateEvent);

// ? Eliminar evento
router.delete('/:id', deleteEvent);

module.exports = router;