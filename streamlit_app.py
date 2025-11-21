import streamlit as st
import math

def rectangle_properties(length, width):
    perimeter = 2 * (length + width)
    area = length * width
    diagonal = math.sqrt(length**2 + width**2)
    return perimeter, area, diagonal

st.title("Tính toán đặc trưng hình học của hình chữ nhật")

# Chia giao diện thành 2 cột
col1, col2 = st.columns(2)

with col1:
    length = st.number_input("Nhập chiều dài (m):", format="%.2f")
with col2:
    width = st.number_input("Nhập chiều rộng (m):", format="%.2f")

if st.button("Tính toán"):
    if length != 0 and width != 0:
        perimeter, area, diagonal = rectangle_properties(length, width)
        
        st.write("### Kết quả tính toán:")
        st.write(f"- Chu vi: {perimeter:.2f} m")
        st.write(f"- Diện tích: {area:.2f} m²")
        st.write(f"- Đường chéo: {diagonal:.2f} m")
    else:
        st.warning("Vui lòng nhập giá trị hợp lệ cho chiều dài và chiều rộng.")
