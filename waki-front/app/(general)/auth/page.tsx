/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Header from "../../components/Navbar/Navbar";
import ImgGoogle from "../../assets/icon-google.png";
import { FaCheckCircle, FaEye, FaEyeSlash } from "react-icons/fa";
import "./auth.css";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../../../firebase/config";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";


export default function AuthTabs() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [activeTab, setActiveTab] = useState("InicioSesion");
  const [isDisabledLogin, setIsDisabledLogin] = useState(true);
  const [isDisabledRegister, setIsDisabledRegister] = useState(true);
  const [passwordsMatch, setPasswordsMatch] = useState({
    password: "",
    confirmPassword: "",
  });

  const [loginFormValues, setLoginFormValues] = useState({
    email: "",
    password: "",
  });

  const [registerFormValues, setRegisterFormValues] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loginFormErrors, setLoginFormErrors] = useState({
    email: "",
    password: "",
  });

  const [registerFormErrors, setRegisterFormErrors] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const router = useRouter();

  const tabs = [
    { id: "InicioSesion", label: "Iniciar Sesión" },
    { id: "Registrate", label: "Regístrate" },
  ];

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateUsername = (username: string) => {
    const usernameRegex = /^[a-zA-Z0-9 ]{3,20}$/;
    return usernameRegex.test(username);
  };
  const validatePassword = (password: string) => {
    return password.length >= 6;
  };

  const validateConfirmPassword = (password: string) => {
    return password.length >= 6;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    formType: string
  ) => {
    const { id, value } = e.target;

    if (formType === "login") {
      setLoginFormValues({ ...loginFormValues, [id]: value });

      if (id === "email" && !validateEmail(value)) {
        setLoginFormErrors({
          ...loginFormErrors,
          email: "El formato del correo es incorrecto.",
        });
      } else if (id === "email") {
        setLoginFormErrors({ ...loginFormErrors, email: "" });
      }

      if (id === "password" && !validatePassword(value)) {
        setLoginFormErrors({
          ...loginFormErrors,
          password: "La contraseña debe tener al menos 6 caracteres.",
        });
      } else if (id === "password") {
        setLoginFormErrors({ ...loginFormErrors, password: "" });
      }
    } else if (formType === "register") {
      setRegisterFormValues({ ...registerFormValues, [id]: value });

      if (id === "username" && !validateUsername(value)) {
        setRegisterFormErrors({
          ...registerFormErrors,
          username: "El formato del usuario es incorrecto.",
        });
      } else if (id === "username") {
        setRegisterFormErrors({ ...registerFormErrors, username: "" });
      }

      if (id === "email" && !validateEmail(value)) {
        setRegisterFormErrors({
          ...registerFormErrors,
          email: "El formato del correo es incorrecto.",
        });
      } else if (id === "email") {
        setRegisterFormErrors({ ...registerFormErrors, email: "" });
      }

      if (id === "password" && !validatePassword(value)) {
        setRegisterFormErrors({
          ...registerFormErrors,
          password: "La contraseña debe tener al menos 6 caracteres.",
        });
      } else if (id === "password") {
        setRegisterFormErrors({ ...registerFormErrors, password: "" });
      }

      if (id === "confirmPassword" && !validateConfirmPassword(value)) {
        setRegisterFormErrors({
          ...registerFormErrors,
          confirmPassword: "La contraseña debe tener al menos 6 caracteres.",
        });
      } else if (id === "confirmPassword") {
        setPasswordsMatch({
          ...passwordsMatch,
          confirmPassword: "Coinciden las contraseñas.",
        });
        setRegisterFormErrors({
          ...registerFormErrors,
          confirmPassword: "",
        });
      }
    }
  };

  const isFormValidLogin = () => {
    const { email, password } = loginFormValues;
    return validateEmail(email) && validatePassword(password);
  };

  const isFormValidRegister = () => {
    const { email, password, confirmPassword, username } = registerFormValues;
    return (
      validateUsername(username) &&
      validateEmail(email) &&
      validatePassword(password) &&
      validateConfirmPassword(confirmPassword) &&
      password === confirmPassword
    );
  };

  useEffect(() => {
    setIsDisabledRegister(!isFormValidRegister());
  }, [registerFormValues, registerFormErrors, isFormValidRegister]);

  useEffect(() => {
    setIsDisabledLogin(!isFormValidLogin());
  }, [loginFormValues, loginFormErrors, isFormValidLogin]);

  const handleGoogleSignIn = async () => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const result = await signInWithPopup(auth, googleProvider);
      router.push("/partidos");
    } catch (error) {
      console.error("Error durante la autenticación con Google:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!validateUsername(registerFormValues.username)) {
      setRegisterFormErrors({
        ...registerFormErrors,
        username: "El formato del usuario es incorrecto.",
      });
      return;
    }
  
    if (!validateEmail(registerFormValues.email)) {
      setRegisterFormErrors({
        ...registerFormErrors,
        email: "El formato del email es incorrecto.",
      });
      return;
    }
  
    if (!validatePassword(registerFormValues.password)) {
      setRegisterFormErrors({
        ...registerFormErrors,
        password: "La contraseña debe tener al menos 6 caracteres.",
      });
      return;
    }
  
    if (registerFormValues.password !== registerFormValues.confirmPassword) {
      setRegisterFormErrors({
        ...registerFormErrors,
        confirmPassword: "Las contraseñas no coinciden.",
      });
      return;
    }
  
    if (!validateConfirmPassword(registerFormValues.confirmPassword)) {
      setRegisterFormErrors({
        ...registerFormErrors,
        confirmPassword: "La contraseña debe tener al menos 6 caracteres.",
      });
      return;
    }
  
    const API_BASE_URL = "https://waki.onrender.com/api";
    const REGISTER_API_URL = `${API_BASE_URL}/auth/register`;
  
    try {
      const response = await fetch(REGISTER_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: registerFormValues.username,
          email: registerFormValues.email,
          password: registerFormValues.password,
          confirmPassword: registerFormValues.confirmPassword,
        }),
      });
  
      if (response.ok) {
        const data = await response.json(); // Obtenemos el cuerpo de la respuesta
        const token = data.token; // Extraemos el token del body
  
        if (token) {
          // Guardar el token en localStorage
          router.push("/partidos"); // Navegar a la página deseada
        } else {
          console.error("No se recibió token en la respuesta.");
        }
      } else {
        const errorData = await response.json();
        console.error("Error en el registro:", errorData);
      }
    } catch (error) {
      console.error("Error en la solicitud de registro:", error);
    }
  };
  
  const handleSubmitLogin = async (e: React.FormEvent) => {
    e.preventDefault();
      
    if (!validateEmail(loginFormValues.email)) {
      setLoginFormErrors({
        ...loginFormErrors,
        email: "Por favor ingresa un correo válido.",
      });
      return;
    }
  
    if (!validatePassword(loginFormValues.password)) {
      setLoginFormErrors({
        ...loginFormErrors,
        password: "La contraseña debe tener al menos 6 caracteres.",
      });
      return;
    }
  
    const API_BASE_URL = "https://waki.onrender.com/api";
    const LOGIN_API_URL = `${API_BASE_URL}/auth/login`;
  
    try {
      const response = await fetch(LOGIN_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: loginFormValues.email,
          password: loginFormValues.password,
        }),
      });
  
      if (response.ok) {
        const data = await response.json();
        const token = data.token;
  
        if (token) {
          
          // Guarda el token en una cookie con js-cookie
          Cookies.set("authToken", token, { expires: 7 }); // El token expira en 7 días
          
          // Redirige al usuario a la página protegida
          router.push("/partidos");
        } else {
          console.error("No se recibió token en la respuesta.");
    
        }
      } else {
        const errorData = await response.json();
        console.error("Error en el login:", errorData);
      }
    } catch (error) {
      console.error("Error en la solicitud de login:", error);
    }
  };
  
  return (
    <>
      <Header tabs={tabs} onTabChange={handleTabChange} />
      <div className="bg-white min-h-screen flex flex-col items-center justify-center px-4">
        {activeTab === "InicioSesion" ? (
          // Pantalla de Iniciar Sesión
          <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-sm">
            <h2
              className="text-2xl font-bold mb-6 text-center"
              style={{ color: "#317EF4" }}
            >
              Bienvenido a Waki,
            </h2>
            <p className="text-gray-600 mb-4 text-center">
              Inicie sesión para disfrutar de todas las funciones
            </p>
            <form onSubmit={handleSubmitLogin}>
              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block text-[#060606] text-sm mb-2"
                >
                  Ingresa tu email o teléfono
                </label>
                <input
                  type="email"
                  id="email"
                  value={loginFormValues.email}
                  onChange={(e) => handleInputChange(e, "login")}
                  className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Email o teléfono"
                />
                {loginFormErrors.email && (
                  <p className="text-red-500 text-xs mt-1">
                    {loginFormErrors.email}
                  </p>
                )}
              </div>
              <div className="mb-4 relative">
                <label
                  htmlFor="password"
                  className="block text-[#060606] text-sm mb-2"
                >
                  Contraseña
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={loginFormValues.password}
                  onChange={(e) => handleInputChange(e, "login")}
                  className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="******************"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
                {loginFormErrors.password && (
                  <p className="text-red-500 text-xs mt-1">
                    {loginFormErrors.password}
                  </p>
                )}
              </div>
              <div className="flex justify-center mt-3">
                <span className="text-blue-500 text-xs">
                  ¿Olvidaste tu contraseña?
                </span>
              </div>

              <div className="flex items-center justify-center mt-5">
                <button
                  className={`bg-[#8E2BFF] btn-box-shadow hover:bg-[#6c22cc] text-white py-2 px-4 border-box w-full focus:outline-none focus:shadow-outline ${
                    isDisabledLogin ? "btn-disabled" : ""
                  }`}
                  type="submit"
                  disabled={isDisabledLogin}
                >
                  Iniciar sesión
                </button>
              </div>

              <div className="flex items-center my-4">
                <div
                  className="flex-grow border-t border-black"
                  style={{ height: "2px" }}
                ></div>
                <span className="mx-4 text-gray-600">O</span>
                <div
                  className="flex-grow border-t border-black"
                  style={{ height: "2px" }}
                ></div>
              </div>

              <div className="flex items-center justify-center">
                <button
                  className="bg-white hover:bg-gray-300 text-[#060606] py-2 px-4 rounded-full mt-2 flex items-center justify-center border border-gray-300"
                  type="button"
                  onClick={handleGoogleSignIn}
                >
                  <Image
                    src={ImgGoogle}
                    width={12}
                    height={12}
                    alt="Google Icon"
                    className="h-5 w-5 mr-2"
                  />
                  <span style={{ color: "rgba(6, 6, 6, 0.57)" }}>
                    Continuar con Google
                  </span>
                </button>
              </div>
            </form>
          </div>
        ) : (
          // Pantalla de Registro
          <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-sm">
            <h2
              className="text-2xl font-bold mb-6 text-center"
              style={{ color: "#317EF4" }}
            >
              Bienvenido a Waki,
            </h2>
            <p className="text-gray-600 mb-4 text-center">
              Crea tu cuenta completando los datos
            </p>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label
                  htmlFor="username"
                  className="block text-[#060606] text-sm mb-2"
                >
                  Nombre de usuario
                </label>
                <input
                  type="text"
                  id="username"
                  value={registerFormValues.username}
                  onChange={(e) => handleInputChange(e, "register")}
                  className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Nombre de usuario"
                />
                {registerFormErrors.username && (
                  <p className="text-red-500 text-xs mt-1">
                    {registerFormErrors.username}
                  </p>
                )}
              </div>
              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block text-[#060606] text-sm mb-2"
                >
                  Ingresa tu email o teléfono
                </label>
                <input
                  type="email"
                  id="email"
                  value={registerFormValues.email}
                  onChange={(e) => handleInputChange(e, "register")}
                  className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Email o teléfono"
                />
                {registerFormErrors.email && (
                  <p className="text-red-500 text-xs mt-1">
                    {registerFormErrors.email}
                  </p>
                )}
              </div>
              <div className="mb-4 relative">
                <label
                  htmlFor="password"
                  className="block text-[#060606] text-sm mb-2"
                >
                  Contraseña
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={registerFormValues.password}
                  onChange={(e) => handleInputChange(e, "register")}
                  className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="******************"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
                {registerFormErrors.password && (
                  <p className="text-red-500 text-xs mt-1">
                    {registerFormErrors.password}
                  </p>
                )}
              </div>
              <div className="mb-4 relative">
                <label
                  htmlFor="confirmPassword"
                  className="block text-[#060606] text-sm mb-2"
                >
                  Repetir contraseña
                </label>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  value={registerFormValues.confirmPassword}
                  onChange={(e) => handleInputChange(e, "register")}
                  className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="******************"
                />
                <button
                  type="button"
                  onClick={toggleConfirmPasswordVisibility}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
                {registerFormErrors.confirmPassword && (
                  <p className="text-red-500 text-xs mt-1">
                    {registerFormErrors.confirmPassword}
                  </p>
                )}
                {passwordsMatch.confirmPassword && (
                  <p className="text-[#279F41] text-xs mt-1 flex items-center">
                    <FaCheckCircle className="mr-1 text-white border border-[#279F41] bg-[#279F41] rounded-full w-4 h-4" />
                    {passwordsMatch.confirmPassword}
                  </p>
                )}
              </div>
              <div className="flex items-center justify-center">
                <button
                  className={`bg-[#8E2BFF] btn-box-shadow hover:bg-[#6c22cc] text-white py-2 px-4 border-box w-full focus:outline-none focus:shadow-outline ${
                    isDisabledRegister ? "btn-disabled" : ""
                  }`}
                  type="submit"
                  disabled={isDisabledRegister}
                >
                  Registrate
                </button>
              </div>
              <div className="flex items-center my-4">
                <div
                  className="flex-grow border-t border-black"
                  style={{ height: "2px" }}
                ></div>
                <span className="mx-4 text-gray-600">O</span>
                <div
                  className="flex-grow border-t border-black"
                  style={{ height: "2px" }}
                ></div>
              </div>

              <div className="flex items-center justify-center">
                <button
                  className="bg-white hover:bg-gray-300 text-[#060606] py-2 px-4 rounded-full mt-2 flex items-center justify-center border border-gray-300"
                  type="button"
                  onClick={handleGoogleSignIn}
                >
                  <Image
                    src={ImgGoogle}
                    width={12}
                    height={12}
                    alt="Google Icon"
                    className="h-5 w-5 mr-2"
                  />
                  <span style={{ color: "rgba(6, 6, 6, 0.57)" }}>
                    Continuar con Google
                  </span>
                </button>
              </div>
              <div className="flex items-center justify-center mt-3">
                <p className="mt-2 text-black text-sm">
                  Al crear una cuenta, estás aceptando los{" "}
                  <span className="text-[#288CE9]">Términos de uso</span> y la{" "}
                  <span className="text-[#288CE9]">
                    Política de privacidad de la empresa
                  </span>
                  .
                </p>
              </div>
            </form>
          </div>
        )}
      </div>
    </>
  );
}
