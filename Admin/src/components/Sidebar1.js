import React, {useState, useContext} from 'react';
import {BrowserRouter, Route, Switch, Link, Redirect} from 'react-router-dom';
import AppContext from '../context/AppContext';

const Sidebar = props => {
  const appContext = useContext(AppContext);

  return(
    <div className="sidebar">
      <div className="logo-cont">
        <Link to="/"><img src={appContext.base_url + 'public/assets/img/logo-w.png'} 
          alt="UğurSoft Yönetim Paneli" /></Link>
      </div>
      <div className="sb-list">

        <ul>
          <li className="icon nav-item-home">
            <Link to="/" className="selected">
              <i className="icon fas fa-home"></i>
              <span>Anasayfa</span>
            </Link>
          </li>
          <li className="sb-head"><span>Ürün Yönetimi</span></li>
          <li>
            <a href="javascript:;">
              <i className="icon fas fa-th"></i>
              <span>Ürün Yönetimi</span>
              <i className="caret fas fa-angle-right"></i>
            </a>
            <ul>
              <li>
                <Link to="/products">
                  <span>Ürünler</span>
                </Link>
              </li>
              <li>
                <a href="javascript:;">
                  <span>Markalar</span>
                </a>
              </li>
              <li>
                <a href="javascript:;">
                  <span>Ürün Özellikleri</span>
                </a>
              </li>
              <li>
                <a href="javascript:;">
                  <span>Ürün Seçenekleri</span>
                </a>
              </li>
              <li>
                <a href="javascript:;">
                  <span>Ürün Yorumları</span>
                </a>
              </li>
              <li>
                <a href="javascript:;">
                  <span>Toplu Fiyat Güncelleme</span>
                </a>
              </li>
              <li>
                <a href="javascript:;">
                  <span>Ürün Sıralama</span>
                </a>
              </li>
            </ul>
          </li>
          <li>
            <Link to="/pages">
              <i className="icon fas fa-sitemap"></i>
              <span>Kategoriler</span>
            </Link>
          </li>
          <li className="sb-head"><span>Sipariş Yönetimi</span></li>
          <li>
            <Link to="/pages">
              <i className="icon fas fa-shopping-cart"></i>
              <span>Sipariş Yönetimi</span>
              <i className="caret fas fa-angle-right"></i>
            </Link>
            <ul>
              <li>
                <a href="javascript:;"><span>Siparişler</span></a>
                <a href="javascript:;"><span>Hatalı Ödemeler</span></a>
                <a href="javascript:;"><span>İptal ve İade Talepleri</span></a>
                <a href="javascript:;"><span>Kargo Firmaları</span></a>
                <a href="javascript:;"><span>Teslimat Bölgeleri</span></a>
                <a href="javascript:;"><span>Bölgelere Ait İller</span></a>
              </li>
            </ul>
          </li>
          <li>
            <Link to="/pages">
              <i className="icon fas fa-gift"></i>
              <span>Kampanya Yönetimi</span>
              <i className="caret fas fa-angle-right"></i>
            </Link>
            <ul>
              <li>
                <a href="javascript:;"><span>Kampanyalar</span></a>
                <a href="javascript:;"><span>Hediye Çekleri</span></a>
                <a href="javascript:;"><span>E-Posta Listesi</span></a>
                <a href="javascript:;"><span>Toplu SMS Gönderimi</span></a>
              </li>
            </ul>
          </li>
          <li>
            <Link to="/pages">
              <i className="icon fas fa-user-friends"></i>
              <span>Müşteri Yönetimi</span>
              <i className="caret fas fa-angle-right"></i>
            </Link>
            <ul>
              <li>
                <a href="javascript:;"><span>Müşteriler</span></a>
                <a href="javascript:;"><span>Müşteri Grupları</span></a>
                <a href="javascript:;"><span>E-Posta Listesi</span></a>
                <a href="javascript:;"><span>Toplu SMS Gönderimi</span></a>
              </li>
            </ul>
          </li>
          <li>
            <Link to="/pages">
              <i className="icon far fa-question-circle"></i>
              <span>Destek Talep Sistemi</span>
              <i className="caret fas fa-angle-right"></i>
            </Link>
            <ul>
              <li>
                <a href="javascript:;"><span>Destek Talepleri</span></a>
                <a href="javascript:;"><span>Personeller</span></a>
              </li>
            </ul>
          </li>

          
          <li className="sb-head"><span>Genel İşlemler</span></li>
          <li>
            <Link to="/pages">
              <i className="icon far fa-edit"></i>
              <span>İçerik Yönetimi</span>
              <i className="caret fas fa-angle-right"></i>
            </Link>
            <ul>
              <li>
                <a href="javascript:;"><span>Sayfalar</span></a>
                <a href="javascript:;"><span>Slider Yönetimi</span></a>
              </li>
            </ul>
          </li>
          <li>
            <Link to="/pages">
              <i className="icon fas fa-cogs"></i>
              <span>Genel Ayarlar</span>
              <i className="caret fas fa-angle-right"></i>
            </Link>
            <ul>
              <li>
                <a href="javascript:;"><span>Ayarlar</span></a>
                <a href="javascript:;"><span>Tasarım Ayarları</span></a>
                <a href="javascript:;"><span>Modül Yönetimi</span></a>
              </li>
            </ul>
          </li>
          <li>
            <Link to="/pages">
              <i className="icon far fa-user"></i>
              <span>Yöneticiler</span>
            </Link>
          </li>
          <li>
            <Link to="/pages">
              <i className="icon fas fa-bars"></i>
              <span>Menü Ayarları</span>
              <i className="caret fas fa-angle-right"></i>
            </Link>
          </li>
          <li>
            <Link to="/pages">
              <i className="icon fas fa-language"></i>
              <span>Dil Ayarları</span>
              <i className="caret fas fa-angle-right"></i>
            </Link>
            <ul>
              <li>
                <a href="javascript:;"><span>Dil Ayarları</span></a>
                <a href="javascript:;"><span>Dil Çevirileri</span></a>
              </li>
            </ul>
          </li>
          <li>
            <Link to="/pages">
              <i className="icon fas fa-credit-card"></i>
              <span>Ödeme Ayarları</span>
              <i className="caret fas fa-angle-right"></i>
            </Link>
            <ul>
              <li>
                <a href="javascript:;"><span>Banka Hesabı Ayarları</span></a>
                <a href="javascript:;"><span>Banka Sanal Pos Ayarları</span></a>
                <a href="javascript:;"><span>Sanal Pos Ayarları</span></a>
                <a href="javascript:;"><span>Kapıda Ödeme Ayarları</span></a>
                <a href="javascript:;"><span>PAYU Ayarları</span></a>
                <a href="javascript:;"><span>İyzico Ayarları</span></a>
                <a href="javascript:;"><span>İpara Ayarları</span></a>
                <a href="javascript:;"><span>HepsiPay Ayarları</span></a>
                <a href="javascript:;"><span>GarantiPay Ayarları</span></a>
                <a href="javascript:;"><span>PayTR Ayarları</span></a>
                <a href="javascript:;"><span>Paratika Ayarları</span></a>
                <a href="javascript:;"><span>TürkPos Ayarları</span></a>
                <a href="javascript:;"><span>Papara Ayarları</span></a>
                <a href="javascript:;"><span>Moka Pos Ayarları</span></a>
                <a href="javascript:;"><span>Ödeme Komisyon Ücretleri</span></a>
                <a href="javascript:;"><span>Ödeme Logları</span></a>
              </li>
            </ul>
          </li>
          <li>
            <Link to="/pages">
              <i className="icon fas fa-link"></i>
              <span>Entegrasyonlar</span>
              <i className="caret fas fa-angle-right"></i>
            </Link>
          </li>
        </ul>
        
      </div>
    </div>
  )
}
export default Sidebar;

