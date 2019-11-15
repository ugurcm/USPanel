import React, {useState, useContext, useEffect} from 'react';
import AppContext from '../../context/AppContext';
import Swal from 'sweetalert2';

export default function UserList (props) {
  return (
    <div className="page-content">
      <div className="page-title">
        <div className="icon">
          <i className="fa fa-user"></i>
        </div>
        <div className="desc">Kullanıcılar</div>
      </div>
      <div className="page-filter"></div>
      <div className="page-list">
        <div className="list-control">
          <div className="control-left">
            <a href="" class="refreshBtn">Yenile</a>
            <a href="" class="addBtn">Ekle</a>
          </div>
          <div className="control-right">
            <div className="tbl-controls">
              <div className="icol">
                <span>Kayıt Sayısı</span>
                <select>
                  <option value="30">30</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                  <option value="150">150</option>
                </select>
              </div>
              <div className="icol">
                <a href=""><i className="fa fa-step-backward"></i></a>
              </div>
              <div className="icol">
                <a href=""><i className="fa fa-angle-left"></i></a>
              </div>
              <div className="icol">
                <span>Sayfa</span>
                <select>
                  <option value="1">1</option>
                  <option value="2">2</option>
                </select>
              </div>
              <div className="icol">
                <span>(0 - 30 / 1)</span>
              </div>
              <div className="icol">
                <a href=""><i className="fa fa-angle-right"></i></a>
              </div>
              <div className="icol">
                <a href=""><i className="fa fa-step-forward"></i></a>
              </div>
            </div>
          </div>
        </div>
        <div className="list-table">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Kullanıcı Adı</th>
                <th>Adı</th>
                <th>Soyadı</th>
                <th>E-Mail</th>
                <th>Son Giriş</th>
                <th>İşlem</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>admin</td>
                <td>ugur</td>
                <td>yılmaz</td>
                <td>ugur@uydusoft.com</td>
                <td>25.02.2019 14:15</td>
                <td>
                  <div className="islemBtns">
                    <a href=""><i className="fas fa-edit"></i></a>
                    <a href=""><i className="fas fa-minus-square"></i></a>
                  </div>
                </td>
              </tr>1
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
