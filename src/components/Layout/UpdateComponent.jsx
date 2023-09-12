import React, { useState } from 'react';
import { FaExclamation, FaWindowClose } from 'react-icons/fa';

const UpdateComponent = ({ data, handleHideUpdateModal, updateFunction, $id }) => {

    const [formData, setFormData] = useState(data);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = () => {
        updateFunction($id, formData);
    };

    return (
        <>
            <div className={`modalWrapper backdrop-blur-sm font-jost z-50 fixed top-0 w-full h-screen flex items-center justify-center`}>
                <div id='modal' className="modal sm bg-[#3e3e3f] backdrop-blur-2xl fixed z-50 p-6 px-8 mx-4 md:mx-auto lg:px-10 rounded-2xl shadow-2xl shadow-black text-white">
                    <form className="">
                        <header className="modal-header py-3 flex items-center justify-between">
                            <div className="exclamation flex space-x-2 items-center">
                                <FaExclamation className="bg-[#F58601] text-4xl p-1 rounded-full" />
                                <h4 className="modal-title text-2xl font-bold">Update Document</h4>
                            </div>
                            <FaWindowClose title='Close' onClick={handleHideUpdateModal} className="text-2xl cursor-pointer" />
                        </header>
                        <div className="modal-content py-6 text-lg">
                            {Object.keys(formData).map((key) => (
                                <input
                                    key={key}
                                    type="text"
                                    name={key}
                                    value={formData[key]}
                                    onChange={handleInputChange}
                                    className="w-full outline-none bg-[#3e3e3f] border-b border-white py-2 px-4 mb-3"
                                    placeholder={`Enter ${key}`}
                                />
                            ))}
                        </div>
                        <div className="modal-footer py-5">
                            <div className="flex space-x-2">
                                <button
                                    title='Cancel'
                                    className="button p-2 hover:bg-white transition-all duration-300 border border-white rounded-lg"
                                    type="button"
                                    onClick={handleHideUpdateModal}
                                >
                                    Cancel
                                </button>
                                <button
                                    title='Update'
                                    className="button p-2 hover:bg-white transition-all duration-300 border border-white rounded-lg"
                                    type="button"
                                    onClick={handleSubmit}
                                >
                                    Update
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default UpdateComponent;
