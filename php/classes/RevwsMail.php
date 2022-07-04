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

if ( ! defined('_TB_VERSION_')) {
    exit;
}

class RevwsMail extends ObjectModel
{
    public static $definition = [
        'table'   => 'revws_review_email',
        'primary' => 'id_email',
        'fields'  => [
            'id_product'  => ['type' => self::TYPE_INT, 'required' => true,],
            'id_customer' => ['type' => self::TYPE_INT, 'required' => true,],
            'token'       => ['type' => self::TYPE_STRING, 'required' => true,],
            'sent'        => ['type' => self::TYPE_BOOL, 'validate' => 'isBool'],
            'reviewed'    => ['type' => self::TYPE_BOOL, 'validate' => 'isBool'],
            'created_at'  => ['type' => self::TYPE_DATE],
            'send_date'   => ['type' => self::TYPE_DATE],
        ],
    ];

    public $id_email;
    public $id_product;
    public $id_customer;
    public $token;
    public $sent;
    public $reviewed;
    public $email;
    public $created_at;
    public $send_date;
}