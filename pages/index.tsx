import { GetServerSideProps } from "next";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "../styles/countries.module.css";

/**
 * Тип данных для описания страны.
 * @property flag_url - URL флага страны.
 * @property name_ru - Название страны на русском языке.
 * @property iso_code2 - Двухбуквенный код страны (ISO).
 * @property iso_code3 - Трёхбуквенный код страны (ISO).
 */

type Country = {
    flag_url: string;
    name_ru: string;
    iso_code2: string;
    iso_code3: string;
};

type CountriesPageProps = {
    initialCountries: Country[];
};

export default function CountriesPage({ initialCountries }: CountriesPageProps) {
    const [countries, setCountries] = useState(initialCountries);

    const handleDelete = (isoCode: string) => {
        setCountries(countries.filter((country) => country.iso_code2 !== isoCode));
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Список стран</h1>
            <ul className={styles.list}>
                <AnimatePresence>
                    {countries.map((country) => (
                        <motion.li
                            key={country.iso_code2}
                            className={styles.listItem}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 100 }}
                            transition={{ duration: 0.4 }}
                            layout
                        >
                            <div className={styles.countryInfo}>
                                <img
                                    src={`https:${country.flag_url}`}
                                    alt={`Flag of ${country.name_ru}`}
                                    className={styles.flag}
                                />
                                <span>{country.name_ru}</span>
                            </div>
                            <button
                                onClick={() => handleDelete(country.iso_code2)}
                                className={styles.deleteButton}
                            >
                                Удалить
                            </button>
                        </motion.li>
                    ))}
                </AnimatePresence>
            </ul>
        </div>
    );
}

// Загрузка списка стран на сервере
export const getServerSideProps: GetServerSideProps = async () => {
    const res = await fetch(
        "https://gist.githubusercontent.com/sanchezzzhak/8606e9607396fb5f8216/raw/39de29950198a7332652e1e8224f988b2e94b166/ISO3166_RU.json"
    );
    const countries: Country[] = await res.json();

    return {
        props: {
            initialCountries: countries,
        },
    };
};
