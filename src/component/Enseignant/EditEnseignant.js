import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Select from 'react-select'; 

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

const EditEnseignant = () => {
    let navigate = useNavigate();
    const { id } = useParams();
    const [enseignant, setEnseignant] = useState({
        nom: '',
        prenom: '',
        department: [],
        experience: '',
        grade: '' 
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadEnseignant();
    }, [id]);

    const loadEnseignant = async () => {
        try {
            const result = await axios.get(`http://localhost:8080/profilEnseignant/${id}`);
            const data = result.data;
            
            const departments = data.department ? data.department.split(', ') : [];
            setEnseignant({ ...data, department: departments });
        } catch (error) {
            setError('Error fetching data');
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

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

    const updateEnseignant = async (e) => {
        e.preventDefault();
        try {
            const updatedEnseignant = { 
                ...enseignant, 
                department: enseignant.department.join(', '),
                grade: enseignant.grade 
            };
            await axios.put(`http://localhost:8080/profilEnseignant/${id}`, updatedEnseignant);
            navigate("/view-enseignant");
        } catch (error) {
            setError('Error updating data');
            console.error('Error updating data:', error);
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    const { nom, prenom, department, experience, grade } = enseignant;

    return (
        <div className='col-sm-8 py-2 px-5 offset-2 shadow'>
            <h2 className='mt-5'>Edit Enseignant</h2>
            <form onSubmit={updateEnseignant}>
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
                <div className='row mb-5'>
                    <div className='col-sm-2'>
                        <button type='submit' className='btn btn-outline-success btn-lg'>Save</button>
                    </div>
                    <div className='col-sm-2'>
                        <Link to='/view-enseignant' className='btn btn-outline-warning btn-lg'>Cancel</Link>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default EditEnseignant;
