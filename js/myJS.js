// Defensive scaffolding - Esqueleto defensivo
const form = document.querySelector('form');
// Variables en JS: con var let y const
// var,es la formaantigua (mejor no usar)
// let -> CUIDADO conel scope. Es a nivel de bloque. Si defino una vble en un if, solo existe en ese if.
// const -> constantes, variables que no cambian su valor

/* ReqJ1 */
if(!form) {
    // No hay form en esta página...
    console.log("¡No hay formulario en esta página!");
    exit(0);
}

/* ReqJ2 */
function updatePreview() {
    const name = document.querySelector("#nombre").value;
    const email = document.querySelector("#email").value;
    const tel = document.querySelector("#telefono").value;
    const mat = document.querySelector("#matricula").value;
    const mensj = document.querySelector("#mensaje").value;
    const preview = document.querySelector("#preview");

    preview.innerHTML = `
        <h3>Vista previa de contacto</h3>
        <p><strong>Nombre:</strong> ${name}</p>
        <p><strong>Correo electrónico:</strong> ${email}</p>
        <p><strong>Teléfono:</strong> ${tel}</p>
        <p><strong>Matrícula:</strong> ${mat}</p>
        <p><strong>Mensaje:</strong> ${mensj}</p>
    `;   
}

/* ReqJ3 */
function checkValidityState(field) {
    // quitar estados previos
    field.classList.remove('valid','invalid');

    // verificar validez HTML5 incorporada
    if (field.checkValidity()) {
        field.classList.add('valid');
    } else {
        field.classList.add('invalid');
    }
}

function validateForm(event) {
    if (event) {
        event.preventDefault();
    }
    // Limpiar el contenedor de errores
    const errorBox = document.getElementById('error-box');
    errorBox.textContent='';
    errorBox.classList.remove('visible');

    // La validación nativa se ejecuta automáticamente porque el formulario tiene atributos required/type
    if (!form.reportValidity()) {
        return false; // el navegador mostrará sus mensajes nativos de validación
    }

    // Validación personalizada entre campos
    const customError = checkCustomRules();
    if (customError) {
        errorBox.textContent = customError;
        errorBox.classList.add('visible');
        /* ReqJ6 */
        document.querySelector('#mensaje').focus();
        return false;
    }

    return true; // permitir envío
}

/* ReqJ5 */
function checkCustomRules() {
    const revisionValue = document.querySelector('#revision').value;
    const mensj = document.querySelector('#mensaje').value.toLowerCase();

    if (revisionValue === 'revision' && !mensj.includes('itv')) {
        return 'Si seleccionas revisión, por favor menciona en el mensaje si es para la itv';
    }

    return null; // sin errores
}

/* ReqJ7 */
function handleKeydown(event) {
    if (event.key == 'Enter') {
        const btn = document.getElementById('enviar');
        btn.classList.add('highlight');
        setTimeout(()=>btn.classList.remove('highlight'),900);
    }
}

/* ReqJ8 */
function handleMouseOver(element) {
    element.classList.add('form-highlight');
}

/* ReqJ8 */
function handleMouseOut(element) {
    element.classList.remove('form-highlight');
}

async function sendSupabaseForm(errorBox) {
    const name = document.getElementById('nombre').value.trim();
    const phone = document.getElementById('telefono').value.trim();
    const email = document.getElementById('email').value.trim();
    const plate = document.getElementById('matricula').value.trim();
    const motive = document.getElementById('servicio').value;
    const description = document.getElementById('mensaje').value.trim();
    const interests = Array.from(document.querySelectorAll('input[name="interests"]:checked'))
        .map(item => item.value).join(', ');
        const { error } = await db.from('contact_messages').insert([{
            name: name,
            phone: phone,
            email: email,
            plate: plate,
            motive: motive,
            description: description}
        ]);
        errorBox.classList.add('visible');
        if (error) {
            errorBox.textContent = 'Error al guardar el mensaje: '+ error.message;
            return;
        }
        errorBox.style.color = 'green';
        errorBox.textContent = 'Mensaje enviado y guardado correctamente.';
        form.reset();
        const preview = document.getElementById('preview');
        if (preview) {  
            preview.innerHTML = '';
        }
}