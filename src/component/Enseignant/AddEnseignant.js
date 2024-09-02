import React, { useState } from 'react';
import Select from 'react-select';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const departmentOptions = [
    { label: "Select All", value: "all" },
    { label: "Cycle Préparatoire", value: "Cycle Préparatoire" },
    { label: "Architecture", value: "Architecture" },
    { label: "Licence  Génie Logiciel et Système d'Information", value: "Licence  Génie Logiciel et Système d'Information" },
    { label: "Licence en Management des Systèmes Industriels", value: "Licence en Management des Systèmes Industriels" },
    { label: "Mastére", value: "Mastére" },
    { label: "Génie Civil", value: "Génie Civil" },
    { label: "Génie des procédés", value: "Génie des procédés" },
    { label: "Génie Industriel", value: "Génie Industriel" },
    { label: "Génie Informatique", value: "Génie Informatique" },
    { label: "Génie Mécanique", value: "Génie Mécanique" },
    { label: "Formation Continue", value: "Formation Continue" }
];

const gradeOptions = [
    { label: "Docteur / Assistant", value: "Docteur / Assistant" },
    { label: "Maître Assistant / Maître Technologue", value: "Maître Assistant / Maître Technologue" },
    { label: "Maître de Conférence / Professeur", value: "Maître de Conférence / Professeur" },
    { label: "Expert", value: "Expert" }
];

const AddEnseignant = () => {
    let navigate = useNavigate();
    const [enseignant, setEnseignant] = useState({
        nom: '',
        prenom: '',
        department: [],
        experience: '',
        grade: ''
    });
    const [cvFile, setCvFile] = useState(null);
    const [carteIdentiteFile, setCarteIdentiteFile] = useState(null);
    const [autorisationFile, setAutorisationFile] = useState(null);
    const [photoFile, setPhotoFile] = useState(null); 
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const { nom, prenom, department, experience, grade } = enseignant;

    const handleInputChange = (e) => {
        setEnseignant({ ...enseignant, [e.target.name]: e.target.value });
    };

    const handleSelectChange = (selectedOptions) => {
        if (selectedOptions.some(option => option.value === 'all')) {
            setEnseignant({ ...enseignant, department: departmentOptions.slice(1).map(option => option.value) });
        } else {
            setEnseignant({ ...enseignant, department: selectedOptions.map(option => option.value) });
        }
    };

    const handleGradeChange = (selectedOption) => {
        setEnseignant({ ...enseignant, grade: selectedOption ? selectedOption.value : '' });
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        if (name === 'cvFile') {
            setCvFile(files[0]);
        } else if (name === 'carteIdentiteFile') {
            setCarteIdentiteFile(files[0]);
        } else if (name === 'autorisationFile') {
            setAutorisationFile(files[0]);
        } else if (name === 'photoFile') { 
            setPhotoFile(files[0]);
        }
    };

    const saveEnseignant = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const formData = new FormData();
        formData.append('nom', nom);
        formData.append('prenom', prenom);
        formData.append('department', department.join(', '));
        formData.append('experience', experience);
        formData.append('grade', grade);
        if (cvFile) {
            formData.append('cvFile', cvFile);
        }
        if (carteIdentiteFile) {
            formData.append('carteIdentiteFile', carteIdentiteFile);
        }
        if (autorisationFile) {
            formData.append('autorisationFile', autorisationFile);
        }
        if (photoFile) { 
            formData.append('photoFile', photoFile);
        }

        try {
            await axios.post('http://localhost:8080/profilEnseignant/createWithAllDocuments', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            navigate("/view-enseignant");
        } catch (error) {
            setError('There was an error submitting the form. Please try again.');
            console.error('There was an error!', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='col-sm-8 py-2 px-5 offset-2 shadow'>
            <h2 className='mt-5'>Add Enseignant</h2>
            {error && <div className='alert alert-danger'>{error}</div>}
            <form onSubmit={saveEnseignant}>
                <div className='input-group mb-5'>
                    <label className='input-group-text' htmlFor='nom'>Nom</label>
                    <input
                        className='form-control col-sm-6'
                        type='text'
                        name='nom'
                        id='nom'
                        required
                        value={nom}
                        onChange={handleInputChange}
                    />
                </div>
                <div className='input-group mb-5'>
                    <label className='input-group-text' htmlFor='prenom'>Prenom</label>
                    <input
                        className='form-control col-sm-6'
                        type='text'
                        name='prenom'
                        id='prenom'
                        required
                        value={prenom}
                        onChange={handleInputChange}
                    />
                </div>
                <div className='input-group mb-5'>
                    <label className='input-group-text' htmlFor='department'>Departments</label>
                    <Select
                        isMulti
                        name='department'
                        options={departmentOptions}
                        className='basic-multi-select'
                        classNamePrefix='select'
                        onChange={handleSelectChange}
                        value={departmentOptions.filter(option => department.includes(option.value))}
                        styles={{
                            container: (provided) => ({
                                ...provided,
                                width: '80%',
                            }),
                            control: (provided) => ({
                                ...provided,
                                height: '110px',
                                minHeight: '110px',
                            }),
                            menu: (provided) => ({
                                ...provided,
                                width: '80%',
                            }),
                            multiValue: (provided) => ({
                                ...provided,
                                height: 'auto',
                            }),
                            multiValueLabel: (provided) => ({
                                ...provided,
                                fontSize: '11px',
                            }),
                        }}
                    />
                </div>
                <div className='input-group mb-5'>
                    <label className='input-group-text' htmlFor='grade'>Grade</label>
                    <Select
                        name='grade'
                        options={gradeOptions}
                        className='basic-single-select'
                        classNamePrefix='select'
                        onChange={handleGradeChange}
                        value={gradeOptions.find(option => option.value === grade)}
                        styles={{
                            container: (provided) => ({
                                ...provided,
                                width: '80%',
                            }),
                            control: (provided) => ({
                                ...provided,
                                height: '40px',
                                minHeight: '40px',
                            }),
                            menu: (provided) => ({
                                ...provided,
                                width: '80%',
                            }),
                        }}
                    />
                </div>
                <div className='input-group mb-5'>
                    <label className='input-group-text' htmlFor='experience'>Experience</label>
                    <textarea
                        className='form-control col-sm-6'
                        name='experience'
                        id='experience'
                        rows='4'
                        value={experience}
                        onChange={handleInputChange}
                    />
                </div>
                <div className='input-group mb-5'>
                    <label className='input-group-text' htmlFor='cvFile'>Upload CV</label>
                    <input
                        className='form-control col-sm-6'
                        type='file'
                        name='cvFile'
                        id='cvFile'
                        onChange={handleFileChange}
                    />
                </div>
                <div className='input-group mb-5'>
                    <label className='input-group-text' htmlFor='carteIdentiteFile'>Upload Carte Identité</label>
                    <input
                        className='form-control col-sm-6'
                        type='file'
                        name='carteIdentiteFile'
                        id='carteIdentiteFile'
                        onChange={handleFileChange}
                    />
                </div>
                <div className='input-group mb-5'>
                    <label className='input-group-text' htmlFor='autorisationFile'>Upload Autorisation d'enseigner</label>
                    <input
                        className='form-control col-sm-6'
                        type='file'
                        name='autorisationFile'
                        id='autorisationFile'
                        onChange={handleFileChange}
                    />
                </div>
                <div className='input-group mb-5'>
                    <label className='input-group-text' htmlFor='photoFile'>Upload a Photo - Optional

</label>
                    <input
                        className='form-control col-sm-6'
                        type='file'
                        name='photoFile'
                        id='photoFile'
                        onChange={handleFileChange}
                    />
                </div>
                <div className='row mb-5'>
                    <div className='col-sm-2'>
                        <button
                            type='submit'
                            className='btn btn-outline-success btn-lg'
                            disabled={loading}
                        >
                            {loading ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                    <div className='col-sm-2'>
                        <Link
                            to='/view-enseignant'
                            className='btn btn-outline-warning btn-lg'
                        >
                            Cancel
                        </Link>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default AddEnseignant;
