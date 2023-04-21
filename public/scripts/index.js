const loginElement = document.querySelector('#login-form');
const contentElement = document.querySelector("#content-sign-in");
const userDetailsElement = document.querySelector('#user-details');
const authBarElement = document.querySelector("#authentication-bar");

// Elements for sensor readings
const tempElement = document.getElementById("temp");
const luzElement = document.getElementById("luz");
const proximidadElement = document.getElementById("proximidad");
const CardAguaElement = document.getElementById("CardAgua");
const ledElement = document.getElementById("led");
const nivelAguaElement = document.getElementById("nivelAgua");
const motorRange = document.getElementById("motor-velocidad");
const motorBubble = document.querySelector(".bubble");
const motorBar = document.querySelector(".bar");

var dbPathLed;
var dbPathVelocidad;

// MANAGE LOGIN/LOGOUT UI
const setupUI = (user) => {
  if (user) {
    //toggle UI elements
    loginElement.style.display = 'none';
    contentElement.style.display = 'block';
    authBarElement.style.display ='block';
    userDetailsElement.style.display ='block';
    userDetailsElement.innerHTML = user.email;

    // get user UID to get data from database
    var uid = user.uid;
    console.log(uid);

    // Database paths (with user UID)
    var dbPathTemp = 'UsersData/' + uid.toString() + '/temperature';
    var dbPathProx = 'UsersData/' + uid.toString() + '/proximidad';
    var dbPathLuz = 'UsersData/' + uid.toString() + '/luz';
    var dbPathProxPorcentaje = 'UsersData/' + uid.toString() + '/proximidadPorcentaje';
    dbPathLed = 'UsersData/' + uid.toString() + '/led';
    dbPathVelocidad = 'UsersData/' + uid.toString()+ '/velocidad';
    dbPathComida = 'UsersData/' + uid.toString()+ '/comida';




    // Database references
    var dbRefTemp = firebase.database().ref().child(dbPathTemp);
    var dbRefProx = firebase.database().ref().child(dbPathProx);
    var dbRefLuz = firebase.database().ref().child(dbPathLuz);
    var dbRefProcPorcentaje = firebase.database().ref().child(dbPathProxPorcentaje);
    //var dbPathLed = firebase.database().ref().child(dbPathLed);
    //var dbRefVelocidad = firebase.database().ref().child(dbPathVelocidad);

    // Update page with new readings
    dbRefTemp.on('value', snap => {

      tempElement.innerText = snap.val().toFixed(2);
      let xtemp = (new Date()).getTime(),
       ytemp= parseFloat(snap.val().toFixed(2));

         // y = parseFloat(this.responseText);
      //console.log(this.responseText);
      if(chartT.series[0].data.length > 40) {
        chartT.series[0].addPoint([xtemp, ytemp], true, true, true);
      } else {
        chartT.series[0].addPoint([xtemp, ytemp], true, false, true);
      }
    
    });

    dbRefLuz.on('value', snap => {
      luzElement.innerText = snap.val().toFixed(2);
      let xluz = (new Date()).getTime(),
       yluz= parseFloat(snap.val().toFixed(2));

         // y = parseFloat(this.responseText);
      //console.log(this.responseText);
      if(chartL.series[0].data.length > 40) {
        chartL.series[0].addPoint([xluz, yluz], true, true, true);
      } else {
        chartL.series[0].addPoint([xluz, yluz], true, false, true);
      }
    });

    dbRefProx.on('value', snap => {
      proximidadElement.innerText = snap.val().toFixed(2);
      let xprox = (new Date()).getTime(),
       yprox= parseFloat(snap.val().toFixed(2));

         // y = parseFloat(this.responseText);
      //console.log(this.responseText);
      if(chartP.series[0].data.length > 40) {
        chartP.series[0].addPoint([xprox, yprox], true, true, true);
      } else {
        chartP.series[0].addPoint([xprox, yprox], true, false, true);
      }
    });

    dbRefProcPorcentaje.on('value', snap => {
      nivelAguaElement.innerText = snap.val().toFixed(2);
      
      if(snap.val()<="20"){
        CardAguaElement.style.color='red';
      }else if(snap.val()>"20" && snap.val()<="70"){
        CardAguaElement.style.color='green';
      }else{
        CardAguaElement.style.color='red';
      }
    });

  // if user is logged out
  } else{
    // toggle UI elements
    loginElement.style.display = 'block';
    authBarElement.style.display ='none';
    userDetailsElement.style.display ='none';
    contentElement.style.display = 'none';
  }
}
function toggleLed() {
  console.log("Toggle");
  if (ledElement.checked) 
  {
    console.log("led ON");
    firebase.database().ref(dbPathLed).set("LED ON");
  }
  else{
    console.log("led OFF");
    firebase.database().ref(dbPathLed).set("LED OFF");
  }
}

function toggleCofre() {
  console.log("Toggle");
  if (cofreElement.checked) 
  {
    console.log("led ON");
    firebase.database().ref(dbPathCofre).set("COFRE ON");
  }
  else{
    console.log("led OFF");
    firebase.database().ref(dbPathCofre).set("COFRE OFF");
  }
}


//MOTOR****
const range = document.getElementById("motor-velocidad");
const bubble = document.querySelector(".speed-text");
const needle = document.querySelector(".needle");
const minRangeText = document.querySelector(".range-text .min");
const maxRangeText = document.querySelector(".range-text .max");
const bar = document.querySelector(".bar");

// Establece los valores mínimo y máximo en el control deslizante
range.min = 0;
range.max = 255;

// Actualiza la referencia de velocidad en Firebase cuando se cambia el valor del control deslizante
range.oninput = function() {
  const percent = (this.value - this.min) / (this.max - this.min) * 100;
  bubble.textContent = this.value;
  firebase.database().ref(dbPathVelocidad).set(Number(this.value));
  needle.style.transform = `rotate(${percent * 1.8 - 180}deg)`;
  bar.style.width = percent + '%';
};

//DISPENSADOR DE COMIDA ****
const btnComida = document.querySelector('#btn-comida');
const loader = document.querySelector('.loader');
const loaderBar = document.querySelector('.loader-bar');

const tiempoDispensado = 5000; // tiempo en milisegundos que tarda en dispensar la comida

function dispensarComida() {
	btnComida.disabled = true; // deshabilitamos el botón
	loader.style.display = 'block'; // mostramos la animación del loader

  
	firebase.database().ref(dbPathComida).set("COMIDA ON");
  console.log("COMIDA ON")
	// simulamos la dispensación de comida (en este caso, simplemente movemos el loader-bar)
	let porcentaje = 0;
	let interval = setInterval(() => {
		porcentaje += 10;
		loaderBar.style.width = porcentaje + '%';
		if (porcentaje >= 100) {
			clearInterval(interval);
			btnComida.disabled = false; // habilitamos el botón
			loader.style.display = 'none'; // ocultamos la animación del loader
      firebase.database().ref(dbPathComida).set("COMIDA OFF");
      console.log("COMIDA OFF")
		}
	}, tiempoDispensado / 10);
}

btnComida.addEventListener('click', () => {
	dispensarComida();
});
