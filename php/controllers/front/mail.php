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
require_once _PS_MODULE_DIR_.'revws/classes/RevwsMail.php';

class RevwsMailModuleFrontController extends ModuleFrontController
{
    public $module;

    public function __construct()
    {
        parent::__construct();
        $this->context  = Context::getContext();
        $this->php_self = 'module-revws-mail';
    }

    public function postProcess()
    {
        $token = Tools::getValue('token');

        if ( ! $this->getReviewIdByToken($token)) {
            Tools::redirect('index.php?controller=404');
        }
    }

    public function getReviewIdByToken($token)
    {
        return Db::getInstance()->getValue(
            (new DbQuery())
                ->select('`id_email`')
                ->from('revws_review_email')
                ->where('`token` = '.$token)
                ->where('`reviewed` = 0')
                ->where('`sent` = 1')
        );
    }

    public function initContent()
    {
        parent::initContent();
        $title       = Tools::getValue('title');
        $content     = Tools::getValue('review');
        $token       = Tools::getValue('token');
        $oId         = $this->getReviewIdByToken($token);
        $o           = new RevwsMail((int)$oId);
        $product_id  = (int)Tools::getValue('product_id');
        $customer_id = (int)Tools::getValue('customer_id');
        if ($o->id_product !== $product_id && $o->id_customer !== $customer_id) {
            Tools::redirect('index.php?controller=404');
        }
        if ( ! $content) {
            Tools::redirect($this->context->link->getProductLink($product_id));
        }
        $score                  = (int)Tools::getValue('score');
        $customer               = new Customer($customer_id);
        $review                 = new RevwsReview();
        $review->id_guest       = 0;
        $review->id_customer    = $customer_id;
        $review->entity_type    = 'product';
        $review->id_entity      = $product_id;
        $review->id_lang        = (int)$this->context->language->id;
        $review->display_name   = $customer->firstname.' '.$customer->lastname;
        $review->email          = $customer->email;
        $review->title          = $title;
        $review->content        = $content;
        $review->date_upd       = new \DateTime();
        $review->grades         = [];
        $review->verified_buyer = 1;
        $review->grades[1]      = $score;
        if ($review->save()) {
            try {
                $o->reviewed = 1;
                $o->save();
            } catch (Exception $e) {

            }
            $this->setTemplate('thankyou.tpl');
        } else {
            $this->setTemplate('failed.tpl');
        }
    }
}
