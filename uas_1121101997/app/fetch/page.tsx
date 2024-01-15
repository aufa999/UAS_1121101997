'use client'
import { useState, useEffect } from "react";
import axios from 'axios';
import { useRouter } from 'next/navigation'
import Modal from "react-modal";

interface Barang {
  id: number;
  attributes: {
    nama_barang: string;
    jenis_barang: string;
    stok_barang: number;
    harga_barang: number;
    supplyer:string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
  };
}

async function getData(): Promise<Barang[]> {
  try {
    const response = await axios.get('http://localhost:1337/api/nama-barangs');
    return response.data.data as Barang[];
  } catch (error) {
    throw new Error("Gagal Mendapat Data");
  }
}

export default function Home() {
  const router = useRouter()
  const [data, setData] = useState<Barang[]>([]);
  const [selectedbarang, setSelectedBarang] = useState<Barang | null>(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [addModalIsOpen, setAddModalIsOpen] = useState(false);
  const [newBarang, setNewBarang] = useState({
    nama_barang: "",
    jenis_barang: "",
    stok_barang: 0,
    harga_barang: 0,
    supplyer:""
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const fetchedData = await getData();
        setData(fetchedData || []);
        console.log(data)
      } catch (error) {
        console.error('Error:', error);
      }
    }

    fetchData();
  }, []);

  const handleShow = (produk: Barang) => {
    setSelectedBarang(produk);
    setModalIsOpen(true);
  };
  const handleCreate = () => {
    setAddModalIsOpen(true)
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewBarang((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await axios.post('http://localhost:1337/api/nama-barangs', {
        data: newBarang
      });
      window.location.reload();
    } catch (error) {
      console.error('Error adding Barang:', error);
    }
  };
  

  const handleDelete = async (barang: Barang) => {
    const userConfirmed = window.confirm(`Deleting Barang: ${barang.attributes.nama_barang} - ${barang.attributes.jenis_barang}`);
    if (userConfirmed) {
    try {
      // Implement your delete logic here
      await axios.delete(`http://localhost:1337/api/nama-barangs/${barang.id}`);
      // Fetch updated data after deletion
      const updatedData = await getData();
      setData(updatedData || []);
    } catch (error) {
      console.error('Error deleting Barang:', error);
    }
  } else{
    window.location.reload();
  }
};

  const closeModal = () => {
    setSelectedBarang(null);
    setModalIsOpen(false);
  };

  return (
    <>
      <div className="head">
        <h1 style={{ color: "blue" }}>Tabel Data Barang</h1>
        <button className="btn btn-green" onClick={() => handleCreate()}>Tambah</button>
      </div>
      <div className="form">
      <table className="table border-collapse border-2 border-gray-500">            
        <thead>
          <tr>
            <th>No</th>
            <th>Nama Barang</th>
            <th>Stok Barang</th>
            <th>Aksi</th>
          </tr>
        </thead>
        
        <tbody>
        {data.map((barang) => (
          <tr key={barang.id}>
          <td>{barang.id}</td>
          <td>{barang.attributes.nama_barang}</td>
          <td>{barang.attributes.stok_barang}</td>
          <td>
              <button className="btn btn-blue" onClick={() => handleShow(barang)}>Detail</button>
              <button className="btn btn-yellow" onClick={() => router.push(`/edit/${barang.id}`)}>Edit</button>
              <button className="btn btn-red" onClick={() => handleDelete(barang)}>Hapus</button>
            </td>
          </tr>
                ))}
        </tbody>
      </table>
      </div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Detail Barang">

        {selectedbarang && (
        <div>
            <h2>Detail Produk</h2>
            <p>Nama Barang: {selectedbarang.attributes.nama_barang}</p>
            <p>Jenis Barang: {selectedbarang.attributes.jenis_barang}</p>
            <p>Stok Barang: {selectedbarang.attributes.stok_barang}</p>
            <p>Harga Barang: {selectedbarang.attributes.harga_barang}</p>
            <p>Suplier: {selectedbarang.attributes.supplyer}</p>
            <button className="btn btn-red" onClick={closeModal}>Tutup</button>
        </div>
        )}
      </Modal>

      <Modal
        isOpen={addModalIsOpen}
        onRequestClose={() => setAddModalIsOpen(false)}
        contentLabel="Form Tambah Barang">
        <div>
            <h2>Tambah Produk</h2>
            <form className="form">
              <label>
                Nama Barang:
                <input type="text" name="nama_barang" onChange={handleInputChange} />
              </label>

              <label>
                Jenis Barang:
                <input type="text" name="jenis_barang" onChange={handleInputChange} />
              </label>

              <label>
                Stok Barang:
                <input type="text" name="stok_barang" onChange={handleInputChange} />
              </label>

              <label>
                Harga Barang:
                <input type="text" name="harga_barang" onChange={handleInputChange} />
              </label>

              <label>
                Supplyer:
                <input type="text" name="supplyer" onChange={handleInputChange} />
              </label>
              <div className="btn-wraper">
              <button type="button" className="btn btn-green" onClick={handleAddSubmit}>Simpan</button>
              <button type="button" className="btn btn-red" onClick={() => setAddModalIsOpen(false)}>Batal</button>
              </div>
            </form>
          </div>
      </Modal>

    </>
  );
}