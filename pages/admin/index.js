"use client";
import React, { useEffect, useState } from "react";
import Navbar from "../../Components/Navbar.jsx";
import AddCenter from "@/Components/AddCenter.jsx";
import RemoveCenter from "@/Components/RemoveCenter.jsx";
import Dosage from "@/Components/Dosage.jsx";
import { useRouter } from "next/router.js";

const Index = () => {
  const router = useRouter();
  const [activeOption, setActiveOption] = useState("Add Center");
  const [user, setUser] = useState({});
  //   console.log(activeOption);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = JSON.parse(localStorage.getItem("userData"));

    if (!token) {
      router.push("/login/admin");
    } else {
      setUser(userData);
    }
  }, []);

  return (
    <div>
      <Navbar activeOption={activeOption} setActiveOption={setActiveOption} />
      {activeOption === "Add Center" ? (
        <AddCenter />
      ) : activeOption === "Remove Center" ? (
        <RemoveCenter />
      ) : (
        <Dosage />
      )}
    </div>
  );
};

export default Index;
