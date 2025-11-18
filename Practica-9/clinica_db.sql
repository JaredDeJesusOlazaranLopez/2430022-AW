-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: localhost
-- Tiempo de generación: 08-11-2025 a las 18:43:00
-- Versión del servidor: 10.4.28-MariaDB
-- Versión de PHP: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `clinica_db`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `bitacoraAcceso`
--

CREATE TABLE `bitacoraAcceso` (
  `idAcceso` int(11) NOT NULL,
  `idUsuario` int(11) DEFAULT NULL,
  `fechaAcceso` datetime DEFAULT NULL,
  `ip` varchar(45) DEFAULT NULL,
  `accion` varchar(250) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `controlAgenda`
--

CREATE TABLE `controlAgenda` (
  `idCita` int(11) NOT NULL,
  `idPaciente` int(11) DEFAULT NULL,
  `idMedico` int(11) DEFAULT NULL,
  `fechaCita` datetime DEFAULT NULL,
  `motivoConsulta` varchar(250) DEFAULT NULL,
  `estadoCita` varchar(20) DEFAULT NULL,
  `observaciones` varchar(250) DEFAULT NULL,
  `fechaRegistro` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `controlMedico`
--

CREATE TABLE `controlMedico` (
  `idMedico` int(11) NOT NULL,
  `nombreCompleto` varchar(150) DEFAULT NULL,
  `cedulaProfesional` varchar(50) DEFAULT NULL,
  `idEspecialidad` int(11) DEFAULT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `correoElectronico` varchar(100) DEFAULT NULL,
  `horarioAtencion` varchar(100) DEFAULT NULL,
  `fechaIngreso` datetime DEFAULT NULL,
  `estatus` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `controlPacientes`
--

CREATE TABLE `controlPacientes` (
  `idPaciente` int(11) NOT NULL,
  `nombreCompleto` varchar(150) DEFAULT NULL,
  `curp` varchar(18) DEFAULT NULL,
  `fechaNacimiento` date DEFAULT NULL,
  `sexo` char(1) DEFAULT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `correoElectronico` varchar(100) DEFAULT NULL,
  `direccion` varchar(250) DEFAULT NULL,
  `contactoEmergencia` varchar(150) DEFAULT NULL,
  `telefonoEmergencia` varchar(20) DEFAULT NULL,
  `alergias` varchar(250) DEFAULT NULL,
  `antecedentesMedicos` text DEFAULT NULL,
  `fechaRegistro` datetime DEFAULT NULL,
  `estatus` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `especialidades`
--

CREATE TABLE `especialidades` (
  `idEspecialidad` int(11) NOT NULL,
  `nombreEspecialidad` varchar(100) DEFAULT NULL,
  `descripcion` varchar(250) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `expedienteClinico`
--

CREATE TABLE `expedienteClinico` (
  `idExpediente` int(11) NOT NULL,
  `idPaciente` int(11) DEFAULT NULL,
  `idMedico` int(11) DEFAULT NULL,
  `fechaRegistro` datetime DEFAULT NULL,
  `diagnostico` text DEFAULT NULL,
  `tratamiento` text DEFAULT NULL,
  `notasMedicas` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `gestorPagos`
--

CREATE TABLE `gestorPagos` (
  `idPago` int(11) NOT NULL,
  `idPaciente` int(11) DEFAULT NULL,
  `idCita` int(11) DEFAULT NULL,
  `idTarifa` int(11) DEFAULT NULL,
  `monto` decimal(10,2) DEFAULT NULL,
  `metodoPago` varchar(50) DEFAULT NULL,
  `fechaPago` datetime DEFAULT NULL,
  `estatus` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `gestorTarifas`
--

CREATE TABLE `gestorTarifas` (
  `idTarifa` int(11) NOT NULL,
  `nombreServicio` varchar(150) DEFAULT NULL,
  `descripcion` varchar(250) DEFAULT NULL,
  `costo` decimal(10,2) DEFAULT NULL,
  `fechaRegistro` datetime DEFAULT NULL,
  `estatus` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `reportes`
--

CREATE TABLE `reportes` (
  `idReporte` int(11) NOT NULL,
  `titulo` varchar(150) DEFAULT NULL,
  `descripcion` text DEFAULT NULL,
  `fechaGeneracion` datetime DEFAULT NULL,
  `tipoReporte` varchar(50) DEFAULT NULL,
  `idUsuario` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `idUsuario` int(11) NOT NULL,
  `nombreUsuario` varchar(100) DEFAULT NULL,
  `contrasena` varchar(150) DEFAULT NULL,
  `rol` varchar(50) DEFAULT NULL,
  `fechaRegistro` datetime DEFAULT NULL,
  `estatus` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `bitacoraAcceso`
--
ALTER TABLE `bitacoraAcceso`
  ADD PRIMARY KEY (`idAcceso`),
  ADD KEY `fk_bitacora_usuario` (`idUsuario`);

--
-- Indices de la tabla `controlAgenda`
--
ALTER TABLE `controlAgenda`
  ADD PRIMARY KEY (`idCita`),
  ADD KEY `fk_agenda_paciente` (`idPaciente`),
  ADD KEY `fk_agenda_medico` (`idMedico`);

--
-- Indices de la tabla `controlMedico`
--
ALTER TABLE `controlMedico`
  ADD PRIMARY KEY (`idMedico`),
  ADD KEY `fk_medico_especialidad` (`idEspecialidad`);

--
-- Indices de la tabla `controlPacientes`
--
ALTER TABLE `controlPacientes`
  ADD PRIMARY KEY (`idPaciente`);

--
-- Indices de la tabla `especialidades`
--
ALTER TABLE `especialidades`
  ADD PRIMARY KEY (`idEspecialidad`);

--
-- Indices de la tabla `expedienteClinico`
--
ALTER TABLE `expedienteClinico`
  ADD PRIMARY KEY (`idExpediente`),
  ADD KEY `fk_expediente_paciente` (`idPaciente`),
  ADD KEY `fk_expediente_medico` (`idMedico`);

--
-- Indices de la tabla `gestorPagos`
--
ALTER TABLE `gestorPagos`
  ADD PRIMARY KEY (`idPago`),
  ADD KEY `fk_pago_paciente` (`idPaciente`),
  ADD KEY `fk_pago_cita` (`idCita`),
  ADD KEY `fk_pago_tarifa` (`idTarifa`);

--
-- Indices de la tabla `gestorTarifas`
--
ALTER TABLE `gestorTarifas`
  ADD PRIMARY KEY (`idTarifa`);

--
-- Indices de la tabla `reportes`
--
ALTER TABLE `reportes`
  ADD PRIMARY KEY (`idReporte`),
  ADD KEY `fk_reporte_usuario` (`idUsuario`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`idUsuario`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `bitacoraAcceso`
--
ALTER TABLE `bitacoraAcceso`
  MODIFY `idAcceso` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `controlAgenda`
--
ALTER TABLE `controlAgenda`
  MODIFY `idCita` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `controlMedico`
--
ALTER TABLE `controlMedico`
  MODIFY `idMedico` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `controlPacientes`
--
ALTER TABLE `controlPacientes`
  MODIFY `idPaciente` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `especialidades`
--
ALTER TABLE `especialidades`
  MODIFY `idEspecialidad` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `expedienteClinico`
--
ALTER TABLE `expedienteClinico`
  MODIFY `idExpediente` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `gestorPagos`
--
ALTER TABLE `gestorPagos`
  MODIFY `idPago` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `gestorTarifas`
--
ALTER TABLE `gestorTarifas`
  MODIFY `idTarifa` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `reportes`
--
ALTER TABLE `reportes`
  MODIFY `idReporte` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `idUsuario` int(11) NOT NULL AUTO_INCREMENT;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `bitacoraAcceso`
--
ALTER TABLE `bitacoraAcceso`
  ADD CONSTRAINT `fk_bitacora_usuario` FOREIGN KEY (`idUsuario`) REFERENCES `usuarios` (`idUsuario`) ON DELETE CASCADE;

--
-- Filtros para la tabla `controlAgenda`
--
ALTER TABLE `controlAgenda`
  ADD CONSTRAINT `fk_agenda_medico` FOREIGN KEY (`idMedico`) REFERENCES `controlMedico` (`idMedico`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_agenda_paciente` FOREIGN KEY (`idPaciente`) REFERENCES `controlPacientes` (`idPaciente`) ON DELETE CASCADE;

--
-- Filtros para la tabla `controlMedico`
--
ALTER TABLE `controlMedico`
  ADD CONSTRAINT `fk_medico_especialidad` FOREIGN KEY (`idEspecialidad`) REFERENCES `especialidades` (`idEspecialidad`) ON DELETE SET NULL;

--
-- Filtros para la tabla `expedienteClinico`
--
ALTER TABLE `expedienteClinico`
  ADD CONSTRAINT `fk_expediente_medico` FOREIGN KEY (`idMedico`) REFERENCES `controlMedico` (`idMedico`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_expediente_paciente` FOREIGN KEY (`idPaciente`) REFERENCES `controlPacientes` (`idPaciente`) ON DELETE CASCADE;

--
-- Filtros para la tabla `gestorPagos`
--
ALTER TABLE `gestorPagos`
  ADD CONSTRAINT `fk_pago_cita` FOREIGN KEY (`idCita`) REFERENCES `controlAgenda` (`idCita`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_pago_paciente` FOREIGN KEY (`idPaciente`) REFERENCES `controlPacientes` (`idPaciente`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_pago_tarifa` FOREIGN KEY (`idTarifa`) REFERENCES `gestorTarifas` (`idTarifa`) ON DELETE SET NULL;

--
-- Filtros para la tabla `reportes`
--
ALTER TABLE `reportes`
  ADD CONSTRAINT `fk_reporte_usuario` FOREIGN KEY (`idUsuario`) REFERENCES `usuarios` (`idUsuario`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
