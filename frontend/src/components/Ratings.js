import { FaStar } from 'react-icons/fa';
import { IconContext } from 'react-icons';
export const Ratings = [
    {
        _id: 0,
        name: <IconContext.Provider value={{ className: 'star-icon' }}>
            <div >
                <FaStar />
            </div>
        </IconContext.Provider>,
        array: [0, 1.9],
    },
    {
        _id: 1,
        name: <IconContext.Provider value={{ className: 'star-icon' }}>
            <div >
                <FaStar /><FaStar />
            </div>
        </IconContext.Provider>,
        array: [2.0, 2.9],
    },
    {
        _id: 2,
        name: <IconContext.Provider value={{ className: 'star-icon' }}>
            <div >
                <FaStar /><FaStar /><FaStar />
            </div>
        </IconContext.Provider>,
        array: [3.0, 3.9],
    },
    {
        _id: 3,
        name: <IconContext.Provider value={{ className: 'star-icon' }}>
            <div >
                <FaStar /><FaStar /><FaStar /><FaStar />
            </div>
        </IconContext.Provider>,
        array: [4.0, 4.9],
    },
    {
        _id: 4,
        name: <IconContext.Provider value={{ className: 'star-icon' }}>
            <div >
                <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
            </div>
        </IconContext.Provider>,
        array: [5.0, 5.1],
    }
];