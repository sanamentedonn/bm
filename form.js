const toggleForms = (enabled) => {
  document.querySelector('button[name="submit"]').disabled = !enabled;
}

const validateName = (formNumber) => {
  const field = $(`input[name="firstname${formNumber}"]`);
  const valid = field.val().length > 1;

  if (valid) {
    field.addClass('valid');
    field.removeClass('invalid');
  } else {
    field.removeClass('valid')
    field.addClass('invalid');
  }

  return valid;
}

const validateLastName = (formNumber) => {
  const field = $(`input[name="lastname${formNumber}"]`);
  const valid = field.val().length > 1;

  if (valid) {
    field.addClass('valid');
    field.removeClass('invalid');
  } else {
    field.removeClass('valid');
    field.addClass('invalid');
  }

  return valid;
}

const validateEmail = async (formNumber) => {
  const field = $(`input[name="email${formNumber}"]`);
  let valid = false;

  const response = await fetch(`ve.php?e=${encodeURIComponent(field.val())}`);
  if (response.status <300) {
    const result = await response.text();
    valid = result === 'ok';
  }

  if (valid) {
    field.addClass('valid');
    field.removeClass('invalid');
  } else {
    field.removeClass('valid');
    field.addClass('invalid');
  }

  return valid;
}

const validatePhone = async (formNumber) => {
  const field = $(`#telephone${formNumber}`);
  const fullNumber = field.intlTelInput("getNumber");
  let valid = false;

  const response = await fetch(`ve.php?p=${encodeURIComponent(fullNumber)}`);
  if (response.status <300) {
    const result = await response.text();
    valid = result === 'ok';
  }

  if (valid) {
    field.addClass('valid');
    field.parent().addClass('valid');
    field.removeClass('invalid');
    field.parent().removeClass('invalid');
  } else {
    field.removeClass('valid');
    field.parent().removeClass('valid');
    field.addClass('invalid');
    field.parent().addClass('invalid');
  }

  return valid;
}


const submitWrapper = function(formNumber = '') {
  return async function(e) {
    const loader = $(`div[name="loader${formNumber}"]`);

    e.preventDefault();
    loader.removeClass('hidden');
    toggleForms(false);

    const nameField = $(`input[name="firstname${formNumber}"]`);
    const lastNameField = $(`input[name="lastname${formNumber}"]`);
    const emailField = $(`input[name="email${formNumber}"]`);
    const fullNumber = $(`#telephone${formNumber}`).intlTelInput("getNumber");

    const a = validateName(formNumber);
    const b = validateLastName(formNumber);
    const c = await validateEmail(formNumber);
    const d = await validatePhone(formNumber);

    if (!a || !b || !c || !d ) {
      toggleForms(true);
      loader.addClass('hidden');
      return;
    }

    const data = {
      name: nameField.val(),
      lastname: lastNameField.val(),
      email: emailField.val(),
      full_number: fullNumber,
    };

    const url = `post.php?subid=${globalSubid}`;

    fbq("track", "Lead");

    $.ajax({
      url,
      data,
      method: `POST`,
      success: function (data) {
        if (data.success) {
          window.location.href = data.success;
        } else if (data.error) {
          alert(data.error.replace(/<[^>]*>?/gm, ''));
        }
        toggleForms(true);
        loader.addClass('hidden');
      },
      error: function (error) {
        console.log('ERROR', error);
        toggleForms(true);
        loader.addClass('hidden');
      }
    });
  }
}

jQuery(function ($) { $("#mainForm").submit(submitWrapper()) });
jQuery(function ($) { $("#secondForm").submit(submitWrapper('2'))});


$(document).ready(() => {
  $('input[name="firstname"]').on('blur', () => validateName(''));
  $('input[name="lastname"]').on('blur', () => validateLastName(''));
  $('input[name="email"]').on('blur', () => validateEmail(''));
  $('#telephone').on('blur', () => validatePhone(''));
});
