import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { trpc } from '@restaurant-system/trpc';

export default function EmployeesListScreen() {
  const navigation = useNavigation();
  const { data: employees, refetch } = trpc.employee.list.useQuery();
  const deleteMutation = trpc.employee.delete.useMutation({
    onSuccess: () => refetch(),
  });

  const handleDelete = async (id: string) => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      await deleteMutation.mutateAsync({ id });
    }
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.employeeCard}>
      <View style={styles.employeeInfo}>
        <Text style={styles.employeeName}>{item.name}</Text>
        <Text style={styles.employeeDetail}>{item.email}</Text>
        <Text style={styles.employeeDetail}>{item.phone}</Text>
        <Text style={styles.employeeDetail}>
          {item.position} / {item.department}
        </Text>
      </View>
      <View style={styles.employeeActions}>
        <TouchableOpacity
          onPress={() => navigation.navigate('EmployeeForm', { employee: item })}
          style={[styles.button, styles.editButton]}
        >
          <Text style={styles.buttonText}>수정</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleDelete(item.id)}
          style={[styles.button, styles.deleteButton]}
        >
          <Text style={styles.buttonText}>삭제</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>직원 관리</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('EmployeeForm')}
          style={styles.addButton}
        >
          <Text style={styles.addButtonText}>직원 추가</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={employees}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  list: {
    padding: 16,
  },
  employeeCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  employeeInfo: {
    marginBottom: 12,
  },
  employeeName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  employeeDetail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  employeeActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    marginLeft: 8,
  },
  editButton: {
    backgroundColor: '#3b82f6',
  },
  deleteButton: {
    backgroundColor: '#ef4444',
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
  },
}); 