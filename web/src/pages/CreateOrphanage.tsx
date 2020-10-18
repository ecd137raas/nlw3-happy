import React, { ChangeEvent, FormEvent, useState } from "react";
import { useHistory } from "react-router-dom";
import { Map, Marker, TileLayer } from 'react-leaflet';
import { FiPlus } from "react-icons/fi";
import L, { LeafletMouseEvent } from 'leaflet';


import Sidebar from '../components/Sidebar';

import mapMarkerImg from '../images/map-marker.svg';
import '../styles/pages/create-orphanage.css';
import api from "../services/api";


const happyMapIcon = L.icon({
  iconUrl: mapMarkerImg,

  iconSize: [58, 68],
  iconAnchor: [29, 68],
  popupAnchor: [0, -60]
})


export default function CreateOrphanage() {
  const history = useHistory();
  const [latLng, setlatLng] = useState({latitude: 0, longitude: 0});
  const [name, setName] = useState('');
  const [about, setAbout] = useState('');
  const [instructions, setInstructions] = useState('');
  const [opening_hours, setOpening_hours] = useState('');
  const [open_on_weekends, setOpenonweekends] = useState(true);
  const [images, setImages] = useState<File[]>([]);

  function handleMapClick(event: LeafletMouseEvent){
    const { lat, lng } = event.latlng;

    setlatLng({
      latitude: lat,
      longitude: lng,
    });

  }
  function handleSelectImages(event: ChangeEvent<HTMLInputElement>){
    if(!event.target.files){
      return;
    }
    
    setImages(Array.from(event.target.files))
  }
  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const { latitude, longitude } = latLng;
    const data = new FormData();
    data.append('name', name);
    data.append('about', about);
    data.append('latitude', String(latitude));
    data.append('longitude', String(longitude));
    data.append('instructions', instructions);
    data.append('opening_hours', opening_hours);
    data.append('open_on_weekends', String(open_on_weekends));
    
    images.forEach(images => {
      data.append('images', images);
    })

    await api.post('orphanages', data);

    alert('Cadastro realizado com sucesso!');

    history.push('/app');

  }

  return (
    <div id="page-create-orphanage">
      <Sidebar />
      <main>
        <form  onSubmit={handleSubmit} className="create-orphanage-form">
          <fieldset>
            <legend>Dados</legend>

            <Map 
              center={[-23.1865,-46.8845]} 
              style={{ width: '100%', height: 280 }}
              zoom={11}
              onclick={handleMapClick}
            >
              <TileLayer url="https://a.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              { latLng.latitude != 0 && (
                <Marker 
                  interactive={false}
                  icon={happyMapIcon} 
                  position={[latLng.latitude,latLng.longitude]} 
                />
              ) 
              }
            </Map>

            <div className="input-block">
              <label htmlFor="name">Nome</label>
              <input id="name" value={name} onChange={event => setName(event.target.value)} />
            </div>

            <div className="input-block">
              <label htmlFor="about">Sobre <span>Máximo de 300 caracteres</span></label>
              <textarea id="about" value={about} onChange={event => setAbout(event.target.value)} maxLength={300} />
            </div>

            <div className="input-block">
              <label htmlFor="images">Fotos</label>

              <div className="images-container">
                <label htmlFor="image[]" className="new-image">
                  <FiPlus size={24} color="#15b6d6" />
                </label>
              </div>
              <input multiple type="file" onChange={handleSelectImages} id="image[]"/>
            </div>
          </fieldset>

          <fieldset>
            <legend>Visitação</legend>

            <div className="input-block">
              <label htmlFor="instructions">Instruções</label>
              <textarea id="instructions" value={instructions} onChange={event => setInstructions(event.target.value)} />
            </div>

            <div className="input-block">
              <label htmlFor="opening_hours">Horário de Visita</label>
              <input id="opening_hours" value={opening_hours} onChange={event => setOpening_hours(event.target.value)} />
            </div>

            <div className="input-block">
              <label htmlFor="open_on_weekends">Atende fim de semana</label>

              <div className="button-select">
                <button type="button" className={open_on_weekends ? 'active' : ''} onClick={()=> setOpenonweekends(true)}>Sim</button>
                <button type="button" className={!open_on_weekends ? 'active' : ''} onClick={()=> setOpenonweekends(false)}>Não</button>
              </div>
            </div>
          </fieldset>

          <button className="confirm-button" type="submit">
            Confirmar
          </button>
        </form>
      </main>
    </div>
  );
}
