{*
* Copyright (C) 2017-2018 Petr Hucik <petr@getdatakick.com>
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
* @copyright 2017-2018 Petr Hucik
* @license   http://opensource.org/licenses/afl-3.0.php  Academic Free License (AFL 3.0)
*}
<section id="revws-section" class="page-product-box">
  <div class="card rounded-0 bg-seashell border-0">
    <div class="card-header bg-seashell rounded-0 border-0">
      <div class="card-collapse-heading row align-items-center justify-content-between"
           data-toggle="collapse"
           href="#idTabRevws"
           role="button"
           aria-expanded="false"
           aria-controls="idTabRevws">
        <div class="col">
          <h4 class="mb-0">{l s='Reviews (%s)' sprintf=[$revwsTotal] mod='revws'}</h4>
        </div>
        <div class="col-auto">
          <div class="collapse-arrow"></div>
        </div>
      </div>
    </div>
    <div class="card-body bg-seashell rounded-0 border-0 p-0">
      <div class="collapse p-3" id="idTabRevws">
          {if $reviewsData.preferences.microdata && $reviewCount>0 && $avgGrade > 0}
            <div class="revws-hidden" itemprop="aggregateRating" itemscope itemtype="http://schema.org/AggregateRating">
              Rated <span itemprop="ratingValue">{$avgGrade|string_format:"%.2f"}</span> on the scale <span itemProp="worstRating">1</span> - <span itemprop="bestRating">5</span> based on <span itemprop="reviewCount">{$reviewCount}</span> customer reviews
            </div>
          {/if}
          {include
          file='modules/revws/views/templates/hook/widget.tpl'
          widget=$widget
          reviewList=$reviewList
          visitor=$visitor
          reviewsData=$reviewsData
          }
      </div>
    </div>
  </div>
</section>
