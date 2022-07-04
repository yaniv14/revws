<?php
/**
* Copyright (C) 2017-2019 Petr Hucik <petr@getdatakick.com>
*
* NOTICE OF LICENSE
*
* This source file is subject to the Academic Free License (AFL 3.0)
* that is bundled with this package in the file LICENSE.txt.
* It is also available through the world-wide-web at this URL:
* http://opensource.org/licenses/afl-3.0.php
* If you did not receive a copy of the license and are unable to
* obtain it through the world-wide-web, please send an email
* to license@getdatakick.com so we can send you a copy immediately.
*
* @author    Petr Hucik <petr@getdatakick.com>
* @copyright 2017-2019 Petr Hucik
* @license   http://opensource.org/licenses/afl-3.0.php  Academic Free License (AFL 3.0)
*/

namespace Revws;

class AppTranslation {
  private $module;

  public function __construct($module) {
    $this->module = $module;
  }

  public function getFrontTranslations() {
    $res = $this->changed(array(
       // FRONT_TRANSLATIONS
    ));
    return $res;
  }

  public function getBackTranslations() {
    $res = $this->changed(array(
      // BACK_TRANSLATIONS
    ));
    return $res;
  }

  private function l($str) {
    return html_entity_decode($this->module->l($str, 'app-translation'));
  }

  private function changed($array) {
    $ret = array();
    foreach ($array as $key => $value) {
      if ($value != $key) {
        $ret[$key] = $value;
      }
    }
    return $ret;
  }
}
