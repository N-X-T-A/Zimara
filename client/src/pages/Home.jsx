import React from 'react';
import Header from '../components/Header';
import CategoriesComponent from '@/components/CategoryList';
import BannerComponents from '@/components/Banner';
import FlashSale from '@/components/FlashSale';
import Footer from './footer';
import ProductCard from '../components/Productlists';

const Home = () => {
    return (
        <>
            <Header></Header>
            <BannerComponents></BannerComponents>
            <CategoriesComponent></CategoriesComponent>
            <FlashSale></FlashSale>
            <ProductCard></ProductCard>
            <Footer></Footer>
        </>
    );
};
export default Home;
