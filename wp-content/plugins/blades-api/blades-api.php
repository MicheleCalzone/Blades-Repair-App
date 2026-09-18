<?php
/*
Plugin Name: Blades API
Description: Serve immagini e report tecnici tramite REST API.
Version: 1.0
Author: Michele Calzone
*/

register_activation_hook(__FILE__, 'blades_auth_install_schema');

require_once __DIR__ . '/image.php';
require_once __DIR__ . '/auth.php';
require_once __DIR__ . '/report-tecnici.php';
require_once __DIR__ . '/inspection-reports.php';
