//Forma manual de inicializar Angular en el Document Ready

var mainApplicationModuleName = 'mean';
var mainApplicationModule = angular.module(mainApplicationModuleName
, []);
angular.element(document).ready(function() {
angular.bootstrap(document, [mainApplicationModuleName]);
});