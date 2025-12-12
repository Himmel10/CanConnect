import streamlit as st
import os
from datetime import datetime
import pandas as pd
import sys

# Add paths
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from document_management.manager import DocumentManager

# Initialize session
if 'user' not in st.session_state:
    st.session_state.user = None

# Configure page
st.set_page_config(
    page_title="Document Management",
    page_icon="📄",
    layout="wide"
)

st.title("📄 Document Management")

# Sidebar
with st.sidebar:
    st.header("Options")
    selected_tab = st.radio(
        "Select Action",
        ["Upload Document", "My Documents", "Verification Queue", "Storage Stats"]
    )

# Initialize document manager
doc_manager = DocumentManager(
    db_host="localhost",
    db_name="canconnect",
    db_user="postgres",
    db_pass="password"
)

# Tab 1: Upload Document
if selected_tab == "Upload Document":
    st.header("Upload Required Documents")
    
    col1, col2 = st.columns(2)
    
    with col1:
        request_id = st.number_input("Service Request ID", min_value=1)
        user_id = st.number_input("Your User ID", min_value=1)
    
    with col2:
        document_type_id = st.number_input("Document Type ID", min_value=1)
        expiry_days = st.number_input("Expiry Days (default 365)", min_value=1, value=365)
    
    st.subheader("Allowed File Types")
    col1, col2, col3 = st.columns(3)
    with col1:
        st.write("📄 PDF")
    with col2:
        st.write("🖼️ JPG/PNG")
    with col3:
        st.write("📝 DOC/DOCX")
    
    st.caption("⚠️ Maximum file size: 10 MB")
    
    uploaded_file = st.file_uploader(
        "Choose a file",
        type=["pdf", "jpg", "jpeg", "png", "doc", "docx"]
    )
    
    if uploaded_file:
        st.write(f"**File:** {uploaded_file.name}")
        st.write(f"**Size:** {uploaded_file.size / 1024:.2f} KB")
        
        if st.button("📤 Upload Document", use_container_width=True):
            # Save temporary file
            temp_path = f"temp_{uploaded_file.name}"
            with open(temp_path, "wb") as f:
                f.write(uploaded_file.getbuffer())
            
            # Validate file
            is_valid, error_msg = doc_manager.validate_file(temp_path)
            
            if not is_valid:
                st.error(f"❌ {error_msg}")
            else:
                # Upload document
                result = doc_manager.upload_document(
                    request_id=request_id,
                    user_id=user_id,
                    file_path=temp_path,
                    document_type_id=document_type_id,
                    expiry_days=expiry_days
                )
                
                if result["success"]:
                    st.success(f"✅ Document uploaded successfully!")
                    st.write(f"**Document ID:** {result['document_id']}")
                    st.write(f"**Storage Path:** {result['file_path']}")
                    st.write(f"**Expiry Date:** {result['expiry_date']}")
                else:
                    st.error(f"❌ {result['message']}")
            
            # Clean up temp file
            if os.path.exists(temp_path):
                os.remove(temp_path)

# Tab 2: My Documents
elif selected_tab == "My Documents":
    st.header("My Uploaded Documents")
    
    request_id = st.number_input("Enter Service Request ID", min_value=1, key="req_id")
    
    if st.button("📂 Load Documents", use_container_width=True):
        documents = doc_manager.get_request_documents(request_id)
        
        if documents:
            st.success(f"Found {len(documents)} document(s)")
            
            for doc in documents:
                with st.container(border=True):
                    col1, col2, col3 = st.columns([2, 1, 1])
                    
                    with col1:
                        st.write(f"**{doc['file_name']}**")
                        st.caption(f"Size: {doc['file_size_formatted']} | Type: {doc['file_type']}")
                    
                    with col2:
                        if doc['is_verified']:
                            st.success("✅ Verified")
                        else:
                            st.warning("⏳ Pending")
                    
                    with col3:
                        col_del, col_down = st.columns(2)
                        with col_down:
                            if st.button("📥", key=f"download_{doc['id']}", help="Download"):
                                file_path = doc_manager.download_document(doc['id'])
                                if file_path and os.path.exists(file_path):
                                    with open(file_path, "rb") as f:
                                        st.download_button(
                                            label="Click to download",
                                            data=f.read(),
                                            file_name=doc['file_name']
                                        )
                        with col_del:
                            if st.button("🗑️", key=f"delete_{doc['id']}", help="Delete"):
                                result = doc_manager.delete_document(doc['id'])
                                if result["success"]:
                                    st.rerun()
        else:
            st.info("No documents found for this request")

# Tab 3: Verification Queue (Staff Only)
elif selected_tab == "Verification Queue":
    st.header("📋 Document Verification Queue")
    
    st.info("🔐 Staff verification interface - requires admin/staff login")
    
    col1, col2 = st.columns(2)
    
    with col1:
        document_id = st.number_input("Document ID to Verify", min_value=1)
    
    with col2:
        staff_id = st.number_input("Your Staff ID", min_value=1)
    
    if st.button("✅ Verify Document", use_container_width=True):
        result = doc_manager.verify_document(document_id, staff_id)
        if result["success"]:
            st.success("Document verified successfully!")
            st.write(f"**Verified At:** {result['verified_at']}")
            st.write(f"**Verified By:** Staff ID {staff_id}")
        else:
            st.error(f"❌ {result['message']}")
    
    st.divider()
    st.subheader("📅 Cleanup Expired Documents")
    
    if st.button("🧹 Run Cleanup", use_container_width=True, type="secondary"):
        cleanup_result = doc_manager.cleanup_expired_documents()
        if cleanup_result["success"]:
            st.success("Cleanup completed!")
            st.write(f"**Documents Archived:** {cleanup_result['archived_count']}")
            st.write(f"**Documents Deleted:** {cleanup_result['deleted_count']}")
            st.write(f"**Total Size Freed:** {cleanup_result['total_size_freed_mb']:.2f} MB")
        else:
            st.error(f"❌ {cleanup_result['message']}")

# Tab 4: Storage Statistics
elif selected_tab == "Storage Stats":
    st.header("💾 Storage Statistics")
    
    stats = doc_manager.get_storage_stats()
    
    col1, col2, col3 = st.columns(3)
    
    with col1:
        st.metric("Total Documents", stats["total_documents"])
    with col2:
        st.metric("Total Size (GB)", f"{stats['total_size_gb']:.2f}")
    with col3:
        st.metric("Average File Size (MB)", f"{stats['avg_file_size_mb']:.2f}")
    
    st.divider()
    st.subheader("📊 Storage by Type")
    
    storage_data = stats["by_storage_type"]
    
    if storage_data:
        df = pd.DataFrame([
            {
                "Storage Type": storage["storage_type"],
                "Documents": storage["count"],
                "Size (MB)": storage["total_size_mb"]
            }
            for storage in storage_data
        ])
        
        st.dataframe(df, use_container_width=True)
        
        # Chart
        st.bar_chart(df.set_index("Storage Type")["Size (MB)"])
    else:
        st.info("No storage data available")
    
    st.divider()
    st.subheader("📈 File Format Breakdown")
    
    format_data = stats["by_file_type"]
    if format_data:
        df_format = pd.DataFrame([
            {
                "Format": fmt["file_type"],
                "Count": fmt["count"],
                "Size (MB)": fmt["total_size_mb"]
            }
            for fmt in format_data
        ])
        
        st.dataframe(df_format, use_container_width=True)
        
        # Pie chart
        st.write("File Type Distribution")
        st.bar_chart(df_format.set_index("Format")["Count"])
    else:
        st.info("No format data available")

# Footer
st.divider()
st.caption(f"Last updated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
st.caption("Document Management System v1.0")
