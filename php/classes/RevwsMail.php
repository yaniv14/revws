<?php

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