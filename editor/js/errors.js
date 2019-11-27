var ERRORS = {
	COMPILER_ERROR: 0,
	MISSING_START: 1,

	ASSIGN_INCORRECT_TYPE: 100,
	ASSIGN_NO_VAR: 101,
	ASSIGN_TO_ARRAY: 102,
	ASSIGN_TO_NOT_ARRAY: 103,

	DECLARE_REDECLARATION: 200,

	OPERATION_INCOMPATIBLE_TYPES: 300,
	OPERATION_INCOMPATIBLE_OPERATION: 301,
	OPERATION_DIVIDE_BY_ZERO: 302,


	METHOD_NO_METHOD: 400,
	METHOD_REDECLARATION: 401,
	METHOD_REDECLARATION_VARIABLE: 402,
	METHOD_PARAM_LENGTH: 403,

	ACCESS_NO_VAR: 500,
	ACCESS_NOT_ARRAY: 501,
	ACCESS_IS_ARRAY: 502,
	ACCESS_ARRAY_INDEX: 503,
}

var ERROR_MESSAGES = {
	0: 'Erorr de compilador.',
	1: 'Falta la función de "start"',

	100: 'Asignación de variables incompatible',
	101: 'Asignación a varibale no existente.',
	102: 'No se puede asignar un valor directamente a un arreglo.',
	103: 'Intentando asignar un valor a un subindice a una variable que no es arreglo.',

	200: 'Redeclaración de variable',

	300: 'Operación en variable incompatibles',
	301: 'Operación en variable incompatibles',
	302: 'División entre cero.',

	400: 'Intentando llamar a una función que no existe',
	401: 'Redeclaración de función con ese nombre.',
	402: 'Intentando declarar una función con el nombre de una variable.',
	403: 'Intentando llamar a una función con el número de variables incorrecto.',

	500: 'Intentando accesar una variable inexistente.',
	501: 'Intentando accesar el subindice de una variable que no es arreglo.',
	502: 'Intentando accesar una variable como si fuera arreglo.',
	503: 'Array index out of bounds.'
}