
// import React, { useState, useEffect } from 'react';

// const SkillForm = ({ initialData = {}, onSubmit, loading }) => {
//     const [formData, setFormData] = useState({
//         name: '',
//         category: '',
//         description: '',
//         level: 'Beginner',
//         about:'',
//     });

//     useEffect(() => {
//         if (initialData) {
//             setFormData(prev => ({
//                 ...prev,
//                 ...initialData
//             }));
//         }
//     }, [initialData]);

//     const handleChange = (e) => {
//         setFormData({ ...formData, [e.target.name]: e.target.value });
//     };

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         onSubmit(formData);
//     };

//     return (
//         <form onSubmit={handleSubmit} className="space-y-4 bg-white shadow p-4 rounded-md max-w-md mx-auto">
//             <div>
//                 <label>Name <span className="text-red-500">*</span></label>
//                 <input
//                     type="text"
//                     name="name"
//                     value={formData.name}
//                     onChange={handleChange}
//                     required
//                     className="input"
//                 />
//             </div>

//             <div>
//                 <label>Category <span className="text-red-500">*</span></label>
//                 <input
//                     type="text"
//                     name="category"
//                     value={formData.category}
//                     onChange={handleChange}
//                     required
//                     className="input"
//                 />
//             </div>

//             <div>
//                 <label>Description</label>
//                 <textarea
//                     name="description"
//                     value={formData.description}
//                     onChange={handleChange}
//                     rows="3"
//                     className="input"
//                 />
//             </div>

//              <div>
//                 <label>About</label>
//                 <textarea
//                     name="about"
//                     value={formData.about}
//                     onChange={handleChange}
//                     rows="3"
//                     className="input"
//                 />
//             </div>

//             <div>
//                 <label>Level</label>
//                 <select
//                     name="level"
//                     value={formData.level}
//                     onChange={handleChange}
//                     className="input"
//                 >
//                     <option>Beginner</option>
//                     <option>Intermediate</option>
//                     <option>Advanced</option>
//                 </select>
//             </div>

//             <button
//                 type="submit"
//                 disabled={loading}
//                 className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//             >
//                 {loading ? 'Saving...' : 'Submit'}
//             </button>
//         </form>
//     );
// };

// export default SkillForm;
