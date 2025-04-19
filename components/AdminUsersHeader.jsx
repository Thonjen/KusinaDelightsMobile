import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';

const AdminUsersHeader = ({
  title,
  searchQuery,
  onSearchChange,
  roleFilter,
  onRoleChange,
}) => {
  const roles = ['all', 'user', 'chef', 'admin'];

  return (
    <View style={styles.header}>
      <View style={styles.topRow}>
        <Image
          source={require('../assets/images/KusinaDelightsLogo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>{title}</Text>
      </View>

      <TextInput
        style={styles.searchInput}
        placeholder="Search users..."
        value={searchQuery}
        onChangeText={onSearchChange}
      />

      <View style={styles.roleButtons}>
        {roles.map(r => (
          <TouchableOpacity
            key={r}
            style={[
              styles.roleBtn,
              roleFilter === r && styles.roleBtnActive,
            ]}
            onPress={() => onRoleChange(r)}
          >
            <Text
              style={[
                styles.roleBtnText,
                roleFilter === r && styles.roleBtnTextActive,
              ]}
            >
              {r === 'all' ? 'All' : r.charAt(0).toUpperCase() + r.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default AdminUsersHeader;

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#F8D64E',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 4,
    boxShadow: "0px 2px 4px rgba(0,0,0,0.4)",
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    justifyContent: 'center',
  },
  logo: {
    width: 50,
    height: 50,
    marginRight: 8,
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#000',
  },
  searchInput: {
    backgroundColor: '#FFF',
    borderRadius: 15,
    paddingHorizontal: 12,
    paddingVertical: 6,
    fontSize: 18,
    marginBottom: 12,
  },
  roleButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  roleBtn: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: '#DDD',
  },
  roleBtnActive: {
    backgroundColor: '#FFF',
  },
  roleBtnText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  roleBtnTextActive: {
    color: '#000',
  },
});
