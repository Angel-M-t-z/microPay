-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 18-09-2025 a las 09:27:43
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `micropay`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `empleados`
--

CREATE TABLE `empleados` (
  `id` int(11) NOT NULL,
  `nombre_completo` varchar(150) NOT NULL,
  `payment_pointer` varchar(255) NOT NULL,
  `frecuencia` enum('diario','semanal','quincenal','mensual') NOT NULL DEFAULT 'quincenal',
  `salario` double NOT NULL DEFAULT 0,
  `divisa` enum('MXN','USD','EUR') NOT NULL DEFAULT 'MXN'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `empleados`
--

INSERT INTO `empleados` (`id`, `nombre_completo`, `payment_pointer`, `frecuencia`, `salario`, `divisa`) VALUES
(1, 'Lizeth Moreno Piña', 'https://ilp.interledger-test.dev/f2145385', 'diario', 10, 'EUR'),
(2, 'Leslie Piña Piña', 'https://ilp.interledger-test.dev/mpl', 'semanal', 70, 'EUR'),
(3, 'Lizeth Moreno Moreno', 'https://ilp.interledger-test.dev/liztext', 'quincenal', 150, 'EUR'),
(4, 'Itzel Lopez Piña', 'https://ilp.interledger-test.dev/platzi-star', 'mensual', 15000, 'MXN'),
(5, 'Miguel Pascual Martinez', 'https://ilp.interledger-test.dev/wall2', 'diario', 400, 'MXN'),
(6, 'Angel Martinez Pascual', 'https://ilp.interledger-test.dev/7d268df1', 'semanal', 40, 'EUR'),
(7, 'Daniel Benitez', 'https://ilp.interledger-test.dev/server', 'quincenal', 4000, 'MXN'),
(8, 'Daniel Martinez', 'https://ilp.interledger-test.dev/56e0d3b8', 'mensual', 400, 'EUR'),
(9, 'Mauricio Nolazco Lonjino', 'https://ilp.interledger-test.dev/platzi-gemini', 'diario', 40, 'MXN'),
(10, 'Angel Lonjino Nolazco', 'https://ilp.interledger-test.dev/safiro', 'semanal', 400, 'USD'),
(11, 'Andres Sanchez Garcia', 'https://ilp.interledger-test.dev/frio', 'quincenal', 4000, 'USD');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `empleados`
--
ALTER TABLE `empleados`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `empleados`
--
ALTER TABLE `empleados`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
