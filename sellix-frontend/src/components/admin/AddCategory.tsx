import { FC, useState } from 'react';

interface Props {
  token: string;
}

const AddCategory: FC<Props> = ({ token }) => {
  const [name, setName] = useState('');

  const handleAdd = async () => {
    await fetch(`http://localhost:3000/api/admin/add-category`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name }),
    });
    setName('');
  };

  return (
    <div>
      <h2 className="text-lg font-semibold mb-2">Add Category</h2>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Category name"
        className="border p-2 rounded w-full mb-2"
      />
      <button onClick={handleAdd} className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600">
        ➕ Add
      </button>
    </div>
  );
};

export default AddCategory;