import React, {useEffect, useState} from 'react';
import ContinuousSlider from "./Monthly/ContinuousSlider.jsx";
import {format} from "date-fns";
import styles from "./HomeApp.module.css";
import {GET_MONTHLY_BUDGET} from "../../apiService.jsx";
import useFetch from "../../Hooks/useFetch.jsx";
import Loading from "../Helper/Loading.jsx";
import HasMonthly from "./Monthly/HasMonthly.jsx";
import MonthValue from '../Month/MonthValue.jsx'

const BudgetUser = () => {

    const [currentDate, setCurrentDate] = useState(new Date());
    const [data, setData] = useState(null);
    const {loading, request} = useFetch();
    const [rotation, setRotation] = useState(0);

    useEffect(() => {
        fetchData(format(currentDate, 'MM/yyyy'));
    }, [currentDate]);

    const fetchData = async (formattedDate) => {
        let [month, year] = formattedDate.split('/');
        const {url, options} = GET_MONTHLY_BUDGET(month, year);
        const {json} = await request(url, options);
        console.log('json')
        console.log(json)
        setData(json)
    };

    const handleRotationChange = (rotation) => {
        setRotation(rotation);
    };

    const handleDateChange = (date) => {
        setCurrentDate(date);
    };

    return (
        <section>
            <div className={styles.monthCurrent}>
                <div className={styles.monthCurrentContainer}>
                    <MonthValue currentDate={currentDate} onDateChange={handleDateChange} rotation={rotation}
                                onRotationChange={handleRotationChange}/>
                </div>
            </div>
            {loading ? <Loading/> : (data ? <HasMonthly body={data}/> :
                <ContinuousSlider formattedDate={format(currentDate, 'MM/yyyy')}/>)}
        </section>
    );
};
export default BudgetUser;
