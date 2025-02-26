import React, { useState, useRef } from 'react';
/* import DatePicker from 'react-datepicker'; */
import ToastifyComponent from '../Toastify/ToastifyComponent';
import { toast } from 'react-toastify';
import ContactFormServices from '../../services/ContactFormServices';
import ContactApiFormServices from '../../services/ContactApiForm';
import Button from '../Button/Button';
import Alert from '../Alert/Alert';
import { parseRealtorDate } from '../../utils';
import { realtorData } from '../../constants/consts/realtor';
import { companyForm } from '../../constants/consts/company';

const MeetingForm = ({ title, subtitle, DataEmail, message }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    termsAndConditions: false,
    companyId: companyForm.id,
    action: message,
    message: message,
    subject: message,
    lastName: '',
    meetingDate: new Date(),
  });

  // Variables Date para poder concatenar con MeetingDate
  const [meetingDate, setMeetingDate] = useState(new Date());
  const [meetingTime, setMeetingTime] = useState('');

  const handleDateChange = (event) => {
    setMeetingDate(event.target.value);
  };

  const handleTimeChange = (event) => {
    setMeetingTime(event.target.value);
  };

  const [errorMsg, setErrorMsg] = useState({
    allFieldRequierd: '',
    serverEmailError: '',
  });
  const [serverErrorMsg, setServerErrorMsg] = useState('');

  // const [successMsg, setSuccessMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState({
    formSubmitMsg: '',
    formApiMsg: '',
  });
  const [loading, setLoading] = useState(false);

  /** Handle Name change */
  const handleNameChange = (ev) => {
    setFormData({
      ...formData,
      name: ev.target.value,
    });
  };

  const handleLastname = (ev) => {
    setFormData({
      ...formData,
      lastName: ev.target.value,
    });
  };

  /** Handle Email change */
  const handleEmailChange = (ev) => {
    setFormData({
      ...formData,
      email: ev.target.value,
    });
  };

  /** Handle Phone change */
  const handlePhoneChange = (ev) => {
    setFormData({
      ...formData,
      phone: ev.target.value,
    });
  };

  const handleAction = (ev) => {
    setFormData({
      ...formData,
      action: ev.target.value,
    });
  };

  const handleTermsAndConditions = (ev) => {
    setFormData({
      ...formData,
      termsAndConditions: !formData.termsAndConditions,
    });
  };

  const resetForm = () => {
    setFormData({
      name: '',
      phone: '',
      email: '',
      termsAndConditions: false,
      companyId: companyForm.id,
      action: 'Servicios: inversionista Unidades nuevas',
      message: 'Servicios: inversionista Unidades nuevas',
      subject: 'Servicios: inversionista Unidades nuevas',
      lastName: '',
      meetingDate: new Date(),
    });
  };

  const onSubmit = (data) => {
    // console.log(data);
  };

  /** On toast success */
  const showToastSuccessMsg = (msg) => {
    toast.success(msg, {
      position: 'bottom-center',
      autoClose: 2500,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'light',
    });
  };

  /** On toast error */
  const showToastErrorMsg = (msg) => {
    toast.error(msg, {
      position: 'bottom-center',
      autoClose: 1000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'light',
    });
  };

  const onFormSubmit = async (ev) => {
    ev.preventDefault();
    const formattedDate = `${meetingDate} ${meetingTime}`;
    const parsedDate = parseRealtorDate(formattedDate);
    const updatedFormData = { ...formData, meetingDate: parsedDate };

    try {
      if (
        Object.values(formData).includes('') ||
        formData?.termsAndConditions === false
      ) {
        setErrorMsg({
          allFieldRequierd:
            'Por favor, completa todos los campos y sacepta los terminos y condiciones',
        });
        return;
      }

      if (!meetingDate || !meetingTime) {
        setErrorMsg({
          allFieldRequierd:
            'Por favor debes definir una fecha y hora de encuentro',
        });
        return;
      }

      if (!formData.meetingDate) {
        setErrorMsg({
          allFieldRequierd:
            'PorRR favor debes definir una fecha y hora de encuentro',
        });
        return;
      }

      setLoading(true);
      const response = await ContactFormServices.sendContactMeetingForm(
        'Unne',
        formData?.name,
        formData?.lastName,
        formData?.phone,
        formData?.meetingDate,
        formData?.email,
        realtorData?.email
      );

      /** Api services */
      const apiResponse = await ContactApiFormServices.addContactForm(formData);

      if (response?.success === 'false') {
        setErrorMsg({
          allFieldRequierd: '',
          serverEmailError:
            'Se necesita activación de email del administrador/a',
        });
        setLoading(false);
        resetForm();
        return;
      }

      if (response.success === 'true' && apiResponse.status === 'ok') {
        setLoading(false);
        setErrorMsg({
          allFieldRequierd: '',
          serverEmailError: '',
        });
        setSuccessMsg({
          formSubmitMsg:
            'Solicitud enviada con exito! Un ejecutivo se contactara contigo',
          formApiMsg: 'Success!!!',
        });
        setTimeout(() => {
          setSuccessMsg({
            formSubmitMsg: '',
            formApiMsg: '',
          });
          resetForm();
          window.location.reload();
        }, 3000);
      }
    } catch (error) {
      setLoading(false);
      setErrorMsg({
        serverEmailError: 'Oh! Ha ocurrido un error al enviar tu solicitud',
      });
    }
  };

  return (
    <div className="bg-gray-200 rounded-[25px] p-4 my-10 xl:py-4 xl:px-10 xl:m-0 w-full ">
      {/* xl:w-3/5 */}
      <div className="text-center">
        <h2 className="text-4xl font-bold py-2 text-gray-800">{title}</h2>
        {subtitle && (
          <p className="text-xl font-semibold text-gray-600">{subtitle}</p>
        )}
      </div>
      <form name="FormsData" onSubmit={onFormSubmit} className="pb-4 px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-20 gap-y-3 py-5 max-sm:divide-y-2 max-sm:divide-[#d8d8da]">
          <div className="max-sm:py-2">
            <label htmlFor="name" className="block text-base font-semibold">
              Nombre:
            </label>
            <input
              className="block w-full rounded-xl bg-slate-50 py-2 px-2 outline-none"
              type="text"
              placeholder="Nombre"
              name="user_name"
              id="name"
              value={formData?.name}
              onChange={handleNameChange}
            />
          </div>

          <div className="max-sm:py-2">
            <label htmlFor="lastname" className="block text-base font-semibold">
              Apellido:
            </label>
            <input
              className="block w-full rounded-xl bg-slate-50 py-2 px-2 outline-none"
              type="text"
              placeholder="Apellido"
              name="user_lastname"
              id="lastname"
              value={formData?.lastName}
              onChange={handleLastname}
            />
          </div>

          <div className="max-sm:py-2">
            <label htmlFor="email" className="block text-base font-semibold">
              Email:
            </label>
            <input
              className="block w-full rounded-xl bg-slate-50 py-2 px-2 outline-none"
              type="email"
              placeholder="email"
              name="user_email"
              id="email"
              value={formData?.email}
              onChange={handleEmailChange}
            />
          </div>

          <div className="max-sm:py-2">
            <label htmlFor="phone" className="block text-base font-semibold">
              Teléfono:
            </label>
            <input
              className="block w-full rounded-xl bg-slate-50 py-2 px-2 outline-none"
              type="text"
              placeholder="Ej: 9 9999 9999"
              name="user_phone"
              id="phone"
              value={formData?.phone}
              onChange={handlePhoneChange}
              pattern="[0-9]{9}"
              maxLength="9"
            />
          </div>
          <div className="max-sm:py-2">
            <label htmlFor="date" className="block text-base font-semibold">
              Fecha:
            </label>
            <input
              className="block w-full rounded-xl py-2 px-2 bg-slate-50 outline-none"
              type="date"
              name="date"
              id="date"
              /*   value={formData?.meetingDate}
                              onChange={(e) =>
                                  setFormData({
                                      ...formData,
                                      meetingDate: e.target.value,
                                  })
                              } */
              value={meetingDate}
              onChange={handleDateChange}
            />
          </div>

          <div className="max-sm:py-2">
            <label htmlFor="tel" className="block text-base font-semibold">
              Hora:
            </label>
            <input
              className="block w-full rounded-xl bg-slate-50 py-2 px-2 outline-none"
              type="time"
              name="time"
              id="time"
              value={meetingTime}
              onChange={handleTimeChange}
            />
          </div>
        </div>

        <div className="w-5/6 mx-auto my-4 mb-6 flex items-center justify-center">
          <div className="mb-[0.125rem] block min-h-[1.5rem] pl-[1.5rem]">
            <input
              className="relative float-left mt-[0.15rem] mr-[6px] -ml-[1.5rem] h-[1.125rem] w-[1.125rem] appearance-none rounded-[0.25rem] border-[0.125rem] border-solid border-neutral-300 outline-none before:pointer-events-none before:absolute before:h-[0.875rem] before:w-[0.875rem] before:scale-0 before:rounded-full before:bg-transparent before:opacity-0 before:shadow-[0px_0px_0px_13px_transparent] before:content-[''] checked:border-primary checked:bg-primary checked:before:opacity-[0.16] checked:after:absolute checked:after:ml-[0.25rem] checked:after:-mt-px checked:after:block checked:after:h-[0.8125rem] checked:after:w-[0.375rem] checked:after:rotate-45 checked:after:border-[0.125rem] checked:after:border-t-0 checked:after:border-l-0 checked:after:border-solid checked:after:border-white checked:after:bg-transparent checked:after:content-[''] hover:cursor-pointer hover:before:opacity-[0.04] hover:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:shadow-none focus:transition-[border-color_0.2s] focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-[0.875rem] focus:after:w-[0.875rem] focus:after:rounded-[0.125rem] focus:after:content-[''] checked:focus:before:scale-100 checked:focus:before:shadow-[0px_0px_0px_13px_#ca6f3b] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] checked:focus:after:ml-[0.25rem] checked:focus:after:-mt-px checked:focus:after:h-[0.8125rem] checked:focus:after:w-[0.375rem] checked:focus:after:rotate-45 checked:focus:after:rounded-none checked:focus:after:border-[0.125rem] checked:focus:after:border-t-0 checked:focus:after:border-l-0 checked:focus:after:border-solid checked:focus:after:border-white checked:focus:after:bg-transparent dark:border-neutral-600 dark:checked:border-primary dark:checked:bg-primary"
              type="checkbox"
              id="terms"
              name="terms"
              checked={formData?.termsAndConditions}
              onChange={handleTermsAndConditions}
            />
            <label
              className="inline-block pl-[0.15rem] hover:cursor-pointer text-gray-600"
              htmlFor="terms"
            >
              Al continuar estás aceptando los términos y condiciones y la
              política de privacidad
            </label>
          </div>
        </div>

        {errorMsg?.serverEmailError && (
          <Alert type="danger" message={errorMsg?.serverEmailError} />
        )}

        {errorMsg.allFieldRequierd && (
          <Alert message={errorMsg.allFieldRequierd} type="danger" />
        )}

        {successMsg?.formSubmitMsg && (
          <div
            className="p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50"
            role="alert"
          >
            {successMsg?.formSubmitMsg}
          </div>
        )}

        <div className="flex justify-center items-center">
          <Button
            value="Send"
            type="submit"
            className="bg-primary rounded-full text-white px-4 py-1 hover:bg-primary-opacity"
          >
            <div className="text-lg font-medium  mx-auto">
              <span className="max-h-10">
                {loading ? (
                  <div role="status">
                    <svg
                      aria-hidden="true"
                      className="inline w-4 h-4 text-gray-100 animate-spin fill-white"
                      viewBox="0 0 100 101"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="currentColor"
                      />
                      <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="currentFill"
                      />
                    </svg>
                    <span className="sr-only">Cargando...</span>
                  </div>
                ) : (
                  'Agenda una reunión'
                )}
              </span>
            </div>
          </Button>
        </div>
      </form>
    </div>
  );
};

export default MeetingForm;
