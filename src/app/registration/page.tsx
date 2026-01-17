const SOLINGEN_DISTRICTS = [
    'Ohligs',
    'Wald',
    'Merscheid',
    'Höhe',
    'Gutenberg',
    'Waldhausen'
];

const registrationForm = () => {
    const [formData, setFormData] = useState({
        city: '',
        district: '', // Added district to formData
    });

    const handleCityChange = (event) => {
        const { value } = event.target;
        setFormData(prev => ({ ...prev, city: value, district: '' })); // Clear district
    };

    const isFormComplete = () => { 
        return formData.city && (formData.city.toLowerCase() !== 'solingen' || formData.district); // Require district if city is Solingen
    };

    const onSubmit = () => {
        const signUpOptions = { 
            district: formData.city.toLowerCase() === 'solingen' ? formData.district : undefined,
            // Other sign-up options...
        };
        // Submission logic...
    };

    return (
        <>
            <select onChange={(e) => setFormData(prev => ({ ...prev, district: e.target.value }))}>
                {formData.city.toLowerCase() === 'solingen' && (
                    <>
                        <option value=''>Stadtteil</option>
                        {SOLINGEN_DISTRICTS.map(district => (
                            <option value={district} key={district}>{district}</option>
                        ))}
                    </>
                )}
            </select>
            {/* Other form elements... */}
        </>
    );
};

export default registrationForm;