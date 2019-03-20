var segundos=0;
var minutos=2;
var i=0;
var generarNuevosDulces=0;
var nuevosDulces=0;
var puntaje=0;
var eliminarDulces=0;
var mostrarDulces=0;
var longitudColumna=["","","","","","",""];
var longitudRestante=["","","","","","",""];
var maximo=0;
var celdas=0;
var tiempoJuego=0;
var contadorTotal=0;
var espera=0;
var movimientos=0;

// -------------------- Acciones a ejecutar al inicio o reinicio ---------
$(".btn-reinicio").click(function(){
  i=0;
  puntaje=0;
  movimientos=0;
  $(".panel-score").css("width","25%");
	$(".panel-tablero").show();
  $(".time").show();
  $("#score-text").html("0");
  $("#movimientos-text").html("0");
  $(".btn-reinicio").html("Reiniciar");
  clearInterval(mostrarDulces);
  clearInterval(eliminarDulces);
  clearInterval(nuevosDulces);
  clearInterval(tiempoJuego);
  minutos=2;
  segundos=0;
  for(var j=1;j<8;j++){
  	$(".col-"+j).children("img").detach();
  };
  mostrarDulces=setInterval(function() {
    llenarTableroConDulces();
    },600);
  tiempoJuego=setInterval(function(){
    temporizador();
    },1000);
});

// ------------------------------- Control del tiempo ----------------
function temporizador(){
	if(segundos!=0){
  	segundos-=1;
  }
  if(segundos==0){
  	if(minutos==0){
      clearInterval(eliminarDulces);
  		clearInterval(tiempoJuego);
  		$(".panel-tablero").hide("drop","slow",mostrarPantallaFin);
  		$(".time").hide();
    }
    segundos=59;
  	minutos=minutos-1;
  }
  $("#timer").html(minutos+":"+segundos);
};

// ---------------- Mostrar el panel-tablero de juego finalizado --------
function mostrarPantallaFin(){
   $( ".panel-score" ).animate({width:'100%'},3000);
   $(".termino").css({"display":"block","text-align":"center"});
};

//---------------Función para comenzar el Juego con dulces aleatorios----------------
function llenarTableroConDulces(){
	i=i+1
	var numeroFigura=0;
	var ruta=0;
	$(".elemento").draggable({disabled:true});
	if(i<8){
		for(var j=1;j<8;j++){
			if($(".col-"+j).children("img:nth-child("+i+")").html()==null){
				numeroFigura=Math.floor(Math.random()*4)+1;
				ruta="image/"+numeroFigura+".png";
				$(".col-"+j).prepend("<img src="+ruta+" class='elemento'/>").css("justify-content","flex-start")
			}
    }
  }
	if(i==8){
    clearInterval(mostrarDulces);
	  eliminarDulces=setInterval(function(){
      eliminarSerieDulces()
	    },150);
  }
};

//---------------Función para eliminar los Dulces--------------------------
function eliminarSerieDulces(){
	celdas=0;
	existeSerieH=buscaSerieH();
	existeSerieV=buscaSerieV();
	for(var j=1;j<8;j++){
		celdas=celdas+$(".col-"+j).children().length;
  }
	if(existeSerieH && existeSerieV && celdas!=49){
		clearInterval(eliminarDulces);
		generarNuevosDulces=0;
		nuevosDulces=setInterval(function(){
			generaDulcesNuevos()
		},600);
  }

	if(existeSerieH || existeSerieV){
		$(".elemento").draggable({disabled:true});
		$("div[class^='col']").css("justify-content","flex-end");
		$(".activo").hide("pulsate",1000,function(){
			var puntajetmp=$(".activo").length;
			$(".activo").remove("img");
			puntaje=puntaje+puntajetmp*10;
			$("#score-text").html(puntaje);
		});
	}
	if(existeSerieH && existeSerieV && celdas==49){
		$(".elemento").draggable({
			disabled:false,
			containment:".panel-tablero",
			revert:true,
			revertDuration:0,
			snap:".elemento",
			snapMode:"inner",
			snapTolerance:40,
			start:function(event,ui){
			movimientos++;
			$("#movimientos-text").html(movimientos);
      }
	  });
	}
	$(".elemento").droppable({
		drop:function (event,ui){
			var dropped=ui.draggable;
			var droppedOn=this;
			espera=0;
			do{
				espera=dropped.swap($(droppedOn));}
			while(espera==0);
			existeSerieH=buscaSerieH();
			existeSerieV=buscaSerieV();
			if(existeSerieH && existeSerieV){
				dropped.swap($(droppedOn));}
			if(existeSerieH || existeSerieV){
				clearInterval(nuevosDulces);
				clearInterval(eliminarDulces);
				eliminarDulces=setInterval(function(){
					eliminarSerieDulces()
				},150);}},
	});
};

//----------Función para la busqueda horizontal de dulces----------------------------
function buscaSerieH(){
	var serieH=true;
	for(var j=1;j<8;j++){
		for(var k=1;k<6;k++){
			var seleccionSrc1=$(".col-"+k).children("img:nth-last-child("+j+")").attr("src");
			var seleccionSrc2=$(".col-"+(k+1)).children("img:nth-last-child("+j+")").attr("src");
			var seleccionSrc3=$(".col-"+(k+2)).children("img:nth-last-child("+j+")").attr("src");
			if((seleccionSrc1==seleccionSrc2) && (seleccionSrc2==seleccionSrc3) && (seleccionSrc1!=null) && (seleccionSrc2!=null) && (seleccionSrc3!=null)){
				$(".col-"+k).children("img:nth-last-child("+(j)+")").attr("class","elemento activo");
				$(".col-"+(k+1)).children("img:nth-last-child("+(j)+")").attr("class","elemento activo");
				$(".col-"+(k+2)).children("img:nth-last-child("+(j)+")").attr("class","elemento activo");
				serieH=false;
			}
		}
	}
	return serieH;
};

//----------Función para la busqueda vertical de dulces------------------------------
function buscaSerieV(){
	var serieV=true;
	for(var l=1;l<6;l++){
		for(var k=1;k<8;k++){
			var seleccionSrc1=$(".col-"+k).children("img:nth-child("+l+")").attr("src");
			var seleccionSrc2=$(".col-"+k).children("img:nth-child("+(l+1)+")").attr("src");
			var seleccionSrc3=$(".col-"+k).children("img:nth-child("+(l+2)+")").attr("src");
			if((seleccionSrc1==seleccionSrc2) && (seleccionSrc2==seleccionSrc3) && (seleccionSrc1!=null) && (seleccionSrc2!=null) && (seleccionSrc3!=null)){
				$(".col-"+k).children("img:nth-child("+(l)+")").attr("class","elemento activo");
				$(".col-"+k).children("img:nth-child("+(l+1)+")").attr("class","elemento activo");
				$(".col-"+k).children("img:nth-child("+(l+2)+")").attr("class","elemento activo");
				seriev=false;
			}
		}
	}
	return serieV;
};

//--------- Función para intercambiar dulces-------------------------------------
jQuery.fn.swap=function(b){
	b=jQuery(b)[0];
	var a=this[0];
	var t=a.parentNode.insertBefore(document.createTextNode(''),a);
	b.parentNode.insertBefore(a,b);
	t.parentNode.insertBefore(b,t);
	t.parentNode.removeChild(t);
	return this;
};

//---------Función para crear nuevos dulces---------------------------------------------
function generaDulcesNuevos(){
	$(".elemento").draggable({disabled:true});
	$("div[class^='col']").css("justify-content","flex-start")
	for(var j=1;j<8;j++){
		longitudColumna[j-1]=$(".col-"+j).children().length;}
	if(generarNuevosDulces==0){
		for(var j=0;j<7;j++){
			longitudRestante[j]=(7-longitudColumna[j]);}
		maximo=Math.max.apply(null,longitudRestante);
		contadorTotal=maximo;}
	if(maximo!=0){
		if(generarNuevosDulces==1){
			for(var j=1;j<8;j++){
				if(contadorTotal>(maximo-longitudRestante[j-1])){
					$(".col-"+j).children("img:nth-child("+(longitudRestante[j-1])+")").remove("img");}}
		}
		if(generarNuevosDulces==0){
			generarNuevosDulces=1;
			for(var k=1;k<8;k++){
				for(var j=0;j<(longitudRestante[k-1]-1);j++){
					$(".col-"+k).prepend("<img src='' class='elemento' style='visibility:hidden'/>");}}
		}
		for(var j=1;j<8;j++){
			if(contadorTotal>(maximo-longitudRestante[j-1])){
				numeroFigura=Math.floor(Math.random()*4)+1;
				ruta="image/"+numeroFigura+".png";
				$(".col-"+j).prepend("<img src="+ruta+" class='elemento'/>");}
		}
	}
	if(contadorTotal==1){
		clearInterval(nuevosDulces);
		eliminarDulces=setInterval(function(){
			eliminarSerieDulces()
		},150);
	}
	contadorTotal=contadorTotal-1;
};

// ------------------------------ Efectos de color para el título ----------
setInterval(function(){
  if ($(".main-titulo").css("color")=="rgb(220, 255, 14)"){
    $(".main-titulo").css("color","#00FFFF");
  }else{
    $(".main-titulo").css("color","#DCFF0E");
  }
} ,1000);
