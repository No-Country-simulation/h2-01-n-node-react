"use client";

import { useState } from "react";
import Image from "next/image";
import Header from "../../components/Navbar/Navbar";
import ImgGoogle from "../../assets/icon-google.png";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./auth.css";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../../../firebase/config";
import { useRouter } from "next/navigation";

export default function AuthTabs() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [activeTab, setActiveTab] = useState("InicioSesion");
  const [loginFormValues, setLoginFormValues] = useState({
    email: "",
    password: "",
  });

  const [registerFormValues, setRegisterFormValues] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loginFormErrors, setLoginFormErrors] = useState({
    email: "",
    password: "",
  });

  const [registerFormErrors, setRegisterFormErrors] = useState({
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

  const validatePassword = (password: string) => {
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

      if (id === "confirmPassword" && value !== registerFormValues.password) {
        setRegisterFormErrors({
          ...registerFormErrors,
          confirmPassword: "Las contraseñas no coinciden.",
        });
      } else if (id === "confirmPassword") {
        setRegisterFormErrors({ ...registerFormErrors, confirmPassword: "" });
      }
    }
  };

  // Función para manejar la autenticación con Google
  const handleGoogleSignIn = async () => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const result = await signInWithPopup(auth, googleProvider);
      router.push("/home");
    } catch (error) {
      console.error("Error durante la autenticación con Google:", error);
    }
  };

  // Manejo de envío para el formulario de registro
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmail(registerFormValues.email)) {
      setRegisterFormErrors({
        ...registerFormErrors,
        email: "Por favor ingresa un correo válido.",
      });
    }

    if (!validatePassword(registerFormValues.password)) {
      setRegisterFormErrors({
        ...registerFormErrors,
        password: "La contraseña debe tener al menos 6 caracteres.",
      });
    }

    if (registerFormValues.password !== registerFormValues.confirmPassword) {
      setRegisterFormErrors({
        ...registerFormErrors,
        confirmPassword: "Las contraseñas no coinciden.",
      });
    }

    if (
      !registerFormErrors.email &&
      !registerFormErrors.password &&
      !registerFormErrors.confirmPassword
    ) {
      console.log("Formulario válido. Procesando envío...");
      // Aquí puedes añadir la lógica de envío de datos
    }
  };

  // Manejo de envío para el formulario de inicio de sesión
  const handleSubmitLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmail(loginFormValues.email)) {
      setLoginFormErrors({
        ...loginFormErrors,
        email: "Por favor ingresa un correo válido.",
      });
    }

    if (!validatePassword(loginFormValues.password)) {
      setLoginFormErrors({
        ...loginFormErrors,
        password: "La contraseña debe tener al menos 6 caracteres.",
      });
    }

    if (!loginFormErrors.email && !loginFormErrors.password) {
      console.log("Formulario de inicio de sesión válido. Procesando...");
      // Aquí puedes añadir la lógica de inicio de sesión
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
                  className="bg-[#8E2BFF] hover:bg-[#6c22cc] text-white py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline"
                  type="submit"
                >
                  Iniciar sesión
                </button>
              </div>

              <div className="flex items-center my-4">
                <div
                  className="flex-grow border-t border-black"
                  style={{ height: "2px" }}
                ></div>
                <span className="mx-4 text-gray-600">O inicia sesión con</span>
                <div
                  className="flex-grow border-t border-black"
                  style={{ height: "2px" }}
                ></div>
              </div>

              <div className="flex items-center justify-center">
                <button
                  className="bg-gray-200 hover:bg-gray-300 text-[#060606] py-2 px-4 rounded-full mt-2 flex items-center justify-center"
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
                  className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Nombre de usuario"
                />
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
              </div>
              <div className="flex items-center justify-center">
                <button
                  className="bg-[#8E2BFF] hover:bg-[#6c22cc] text-white py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline"
                  type="submit"
                >
                  Registrate
                </button>
              </div>
              <div className="flex items-center my-4">
                <div
                  className="flex-grow border-t border-black"
                  style={{ height: "2px" }}
                ></div>
                <span className="mx-4 text-gray-600">O registrate con</span>
                <div
                  className="flex-grow border-t border-black"
                  style={{ height: "2px" }}
                ></div>
              </div>

              <div className="flex items-center justify-center">
                <button
                  className="bg-gray-200 hover:bg-gray-300 text-[#060606] py-2 px-4 rounded-full mt-2 flex items-center justify-center"
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
        )}
      </div>
    </>
  );
}
