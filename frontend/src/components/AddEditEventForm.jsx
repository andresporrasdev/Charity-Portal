import React, { useState } from 'react';
import './Event.css'; 

const AddEditEventForm = ({ event, onSave, onCancel }) => {
    const [formData, setFormData] = useState( event || {
        id: '',
        name: '',
        description: '',
        time: '',
        place: '',
        pricePublic: '',
        priceMember: '',
        isMemberOnly: false,
        imageUrl: ''
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <form className="add-edit-event-form" onSubmit={handleSubmit}>
            <h2>{event ? 'Edit Event' : 'Add Event'}</h2>
            <label>
                ID:
                <input type="text" name="id" value={formData.id} onChange={handleChange} disabled={!!event} required />
            </label>
            <label>
                Name:
                <input type="text" name="name" value={formData.name} onChange={handleChange} required />
            </label>
            <label>
                Description:
                <textarea name="description" value={formData.description} onChange={handleChange} required></textarea>
            </label>
            <label>
                Time:
                <input type="datetime-local" name="time" value={formData.time} onChange={handleChange} required />
            </label>
            <label>
                Place:
                <input type="text" name="place" value={formData.place} onChange={handleChange} required />
            </label>
            <label>
                Price (Public):
                <input type="text" name="pricePublic" value={formData.pricePublic} onChange={handleChange} required />
            </label>
            <label>
                Price (Members Only):
                <input type="text" name="priceMember" value={formData.priceMember} onChange={handleChange} />
            </label>
            <label>
                Member Only:
                <input type="checkbox" name="isMemberOnly" checked={formData.isMemberOnly} onChange={handleChange} />
            </label>
            <label>
                Image URL:
                <input type="text" name="imageUrl" value={formData.imageUrl} onChange={handleChange} required />
            </label>
            <div className="form-actions">
                <button type="submit" className="action-button">{event ? 'Save Changes' : 'Add Event'}</button>
                <button type="button" className="action-button" onClick={onCancel}>Cancel</button>
            </div>
        </form>
    );
};

export default AddEditEventForm;
