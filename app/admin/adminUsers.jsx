import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Text,
} from 'react-native';
import { useRouter } from 'expo-router';
import AdminUsersHeader from '../../components/AdminUsersHeader';
import AdminUserCard from '../../components/AdminUserCard';
import AdminBottomNavbar from '../../components/AdminBottomNavbar';
import Pagination from '../../components/Pagination';
import * as database from '../../database/database';

const AdminUsers = () => {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [roleFilter, setRoleFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    (async () => {
      const all = await database.getUsers();
      setUsers(all);
    })();
  }, []);

  // apply role + search filters
  const filtered = users.filter(u => {
    if (roleFilter !== 'all' && u.role !== roleFilter) return false;
    const q = searchQuery.toLowerCase();
    return (
      u.username.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q)
    );
  });

  const totalPages = Math.ceil(filtered.length / pageSize);
  const start = (currentPage - 1) * pageSize;
  const currentUsers = filtered.slice(start, start + pageSize);

  const handleView = u => router.push(`/admin/adminUserDetail?id=${u.id}`);
  const handleEdit = u => router.push(`/admin/adminEditUser?id=${u.id}`);

  return (
    <View style={styles.container}>
      <AdminUsersHeader
        title="Users"
        searchQuery={searchQuery}
        onSearchChange={q => {
          setSearchQuery(q);
          setCurrentPage(1);
        }}
        roleFilter={roleFilter}
        onRoleChange={r => {
          setRoleFilter(r);
          setCurrentPage(1);
        }}
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {currentUsers.map(u => (
          <AdminUserCard
            key={u.id}
            user={u}
            onView={handleView}
            onEdit={handleEdit}
          />
        ))}

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={pageSize}
          onPageSizeChange={v => {
            setPageSize(v);
            setCurrentPage(1);
          }}
          onNextPage={() => currentPage < totalPages && setCurrentPage(p => p+1)}
          onPrevPage={() => currentPage > 1 && setCurrentPage(p => p-1)}
        />

        <TouchableOpacity
          style={styles.createButton}
          onPress={() => router.push('/admin/adminCreateUser')}
        >
          <Text style={styles.createButtonText}>New User</Text>
        </TouchableOpacity>
      </ScrollView>

      <AdminBottomNavbar />
    </View>
  );
};

export default AdminUsers;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  scrollContent: { paddingTop: 10, paddingBottom: 80 },
  createButton: {
    backgroundColor: '#FFA500',
    marginHorizontal: 16,
    marginVertical: 16,
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 2,
  },
  createButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
