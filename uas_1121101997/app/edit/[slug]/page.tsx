'use client'
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation'

interface EditPageProps {
  params: {
    slug: string;
  };
}

interface Barang {
  id: number;
  attributes: {
    nama_barang: string;
    jenis_barang: string;
    stok_barang: number;
    harga_barang: number;
    supplyer: string;
  };
}

const EditPage = ({ params }: EditPageProps) => {
  const router = useRouter()
  const id = params.slug
  const [formData, setFormData] = useState({
    nama_barang: "",
    jenis_barang: "",
    stok_barang: 0,
    harga_barang: 0,
    supplyer:""
  });
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (id) {
          const response = await axios.get(`http://localhost:1337/api/nama-barangs/${id}`);
          const barangData = response.data.data as Barang;
          setFormData({
            nama_barang: barangData.attributes.nama_barang,
            jenis_barang: barangData.attributes.jenis_barang,
            stok_barang: barangData.attributes.stok_barang,
            harga_barang: barangData.attributes.harga_barang,
            supplyer: barangData.attributes.supplyer,
          });
        }
      } catch (error) {
        console.error('Error fetching Barang:', error);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await axios.put(`http://localhost:1337/api/nama-barangs/${id}`, {
        data: formData,
      });
      // Redirect to the Barang list page after successful submission
      router.push('/fetch');
    } catch (error) {
      console.error('Error updating Barang:', error);
    }
  };

  return (
    <div className='wraper-form'>
          <form className='form'  style={{width:'80%'}}>
            <label>
              Nama Barang:
              <input
                type="text"
                name="nama_barang"
                value={formData.nama_barang}
                onChange={handleChange}
              />
            </label>
            <label>
              Jenis Barang:
              <input
                type="text"
                name="jenis_barang"
                value={formData.jenis_barang}
                onChange={handleChange}
              />
            </label>
            <label>
              Stok Barang:
              <input
                type="number"
                name="stok_barang"
                value={formData.stok_barang}
                onChange={handleChange}
              />
            </label>
            <label>
              Harga Barang:
              <input
                type="number"
                name="harga_barang"
                value={formData.harga_barang}
                onChange={handleChange}
              />
            </label>
            <label>
              Suplier Barang:
              <input
                type="text"
                name="supplyer"
                value={formData.supplyer}
                onChange={handleChange}
              />
            </label>
            <div className='btn-wraper'>
            <button className="btn btn-green" type="button" onClick={handleSubmit}>
              Simpan
            </button>
            <button className="btn btn-red" type="button" onClick={handleSubmit}>
              Batal
            </button>
            </div>
          </form>
    </div>
  );
};

export default EditPage;
