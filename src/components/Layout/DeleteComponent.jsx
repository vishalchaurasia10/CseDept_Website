import React from 'react'
import { FaExclamation, FaWindowClose } from 'react-icons/fa';

const DeleteComponent = ({ handleHideModal, showModal, removeCard, $id, url }) => {

    return (
        <>
            <div className={`modalWrapper ${showModal ? '' : 'hidden'} bg-[rgba(0,0,0,0.8)] font-jost z-50 fixed top-0 -left-2 w-screen h-screen flex items-center justify-center`}>
                <dialog id='modal' className="modal bg-[#3e3e3f] fixed z-50 p-6 px-8 mx-4 md:mx-auto lg:px-10 rounded-2xl shadow-2xl shadow-black text-white">
                    <form className="">
                        <header className="modal-header py-3 flex items-center justify-between">
                            <div className="excalmation flex space-x-2 items-center">
                                <FaExclamation className="bg-[#F58601] text-4xl p-1 rounded-full" />
                                <h4 className="modal-title text-2xl font-bold">Delete Note</h4>
                            </div>
                            <FaWindowClose title='Close' onClick={handleHideModal} className="text-2xl cursor-pointer" />
                        </header>
                        <div className="modal-content pb-6 text-lg">
                            <p>Are you sure you want to delete <span className='font-bold'>this Note</span>?</p>
                        </div>
                        <div className="modal-footer py-5 border-t">
                            <div className="flex space-x-2">
                                <button title='Cancel' onClick={handleHideModal} className="button p-2 hover:bg-white transition-all duration-300 border border-white rounded-lg" type="button">Cancel</button>
                                <button title='Delete' onClick={() => { removeCard($id, url) }} className="button p-2 hover:bg-white transition-all duration-300 border border-white rounded-lg" type="button">Delete</button>
                            </div>
                        </div>
                    </form>
                </dialog>
            </div>
        </>
    )
}

export default DeleteComponent
