<?php

if ( ! defined('_TB_VERSION_')) {
    exit;
}
require_once _PS_MODULE_DIR_.'revws/classes/RevwsMail.php';

class RevwsDailyCheckModuleFrontController extends ModuleFrontController
{
    public $module;

    public function initContent()
    {
        $token = Tools::getValue('token');
        if ($token !== 'berezrocks') {
            die('invalid token');
        }

        $emails = $this->getTodayEmails();
        if ($emails) {
            foreach ($emails as $email) {
                $emailObject   = new RevwsMail((int)$email['id_email']);
                $customer      = new Customer((int)$email['id_customer']);
                $product       = new Product((int)$email['id_product']);
                $product_name  = $product->name[(int)$this->context->language->id];
                $product_url   = $this->context->link->getProductLink((int)$email['id_product']);
                $logo          = $this->context->link->getMediaLink(_PS_IMG_.Configuration::get('PS_LOGO'));
                $form_url      = $this->context->link->getModuleLink(
                    'revws',
                    'mail',
                    [
                        'utm_source'   => 'system',
                        'utm_medium'   => 'mail',
                        'utm_campaign' => 'review',
                    ],
                    Configuration::get('PS_SSL_ENABLED')
                );
                $template_vars = [
                    '{shop_logo}'    => $logo,
                    '{shop_name}'    => 'ברז',
                    '{buyer_name}'   => $customer->firstname.' '.$customer->lastname,
                    '{product_name}' => $product_name,
                    '{product_url}'  => $product_url,
                    '{form_url}'     => $form_url,
                    '{token}'        => $emailObject->token,
                    '{product_id}'   => (int)$email['id_product'],
                    '{customer_id}'  => (int)$email['id_customer'],
                ];

                if (Mail::Send(
                    $this->context->language->id,
                    'revws-author-review-by-mail',
                    'אנא כתוב ביקורת על קנייתך בברז',
                    $template_vars,
                    $customer->email,
                    null,
                    'contact@berez.co.il',
                    'Berez',
                    null,
                    null,
                    _PS_MODULE_DIR_.$this->module->name.'/mails/',
                    false,
                    $this->context->shop->id,
                    null,
                    null
                )
                ) {
                    /* Mark email has sent */
                    $emailObject->sent = 1;
                    $emailObject->save();
                } else {
                    /* Send mail to admin */
                    Mail::Send(
                        $this->context->language->id,
                        'revws-review-by-mail-fail',
                        'Berez review mail failed',
                        [
                            '{email_id}'    => $email['id_email'],
                            '{email}'       => $customer->email,
                            '{customer_id}' => $email['id_customer'],
                        ],
                        'yanivmirel@gmail.com',
                        null,
                        'contact@berez.co.il',
                        'Berez',
                        null,
                        null,
                        _PS_MODULE_DIR_.$this->module->name.'/mails/',
                        false,
                        $this->context->shop->id,
                        null,
                        null
                    );
                }
            }
        }

        die('N/A');
    }

    public static function getTodayEmails()
    {
        return Db::getInstance(_PS_USE_SQL_SLAVE_)->executeS(
            (new DbQuery())
                ->select('*')
                ->from('revws_review_email')
                ->where('`sent` = 0')
                ->where('`reviewed` = 0')
                ->where('DATE_FORMAT(`send_date`, "%d%m%Y") = '.(int)date('dmY'))
        );
    }
}