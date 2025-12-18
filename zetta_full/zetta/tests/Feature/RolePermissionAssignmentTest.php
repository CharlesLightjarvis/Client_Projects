<?php

namespace Tests\Feature;

use App\Models\Role;
use App\Models\Permission;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RolePermissionAssignmentTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        
        // Create a test user for authentication
        $this->user = User::factory()->create();
        $this->actingAs($this->user);
    }

    /** @test */
    public function it_can_assign_permissions_to_role()
    {
        // Create a role and permissions
        $role = Role::create(['name' => 'test-role', 'guard_name' => 'web']);
        $permission1 = Permission::create(['name' => 'test-permission-1', 'guard_name' => 'web']);
        $permission2 = Permission::create(['name' => 'test-permission-2', 'guard_name' => 'web']);

        // Assign permissions to role
        $response = $this->postJson("/api/v1/admin/roles/{$role->id}/permissions/assign", [
            'permission_ids' => [$permission1->id, $permission2->id]
        ]);

        $response->assertStatus(200)
                ->assertJson([
                    'success' => true,
                    'message' => 'Permissions assigned successfully'
                ]);

        // Verify permissions were assigned
        $this->assertTrue($role->hasPermissionTo($permission1));
        $this->assertTrue($role->hasPermissionTo($permission2));
    }

    /** @test */
    public function it_can_revoke_permissions_from_role()
    {
        // Create a role and permissions
        $role = Role::create(['name' => 'test-role', 'guard_name' => 'web']);
        $permission1 = Permission::create(['name' => 'test-permission-1', 'guard_name' => 'web']);
        $permission2 = Permission::create(['name' => 'test-permission-2', 'guard_name' => 'web']);

        // Assign permissions first
        $role->givePermissionTo([$permission1, $permission2]);

        // Revoke one permission
        $response = $this->postJson("/api/v1/admin/roles/{$role->id}/permissions/revoke", [
            'permission_ids' => [$permission1->id]
        ]);

        $response->assertStatus(200)
                ->assertJson([
                    'success' => true,
                    'message' => 'Permissions revoked successfully'
                ]);

        // Verify permission was revoked (refresh the role and clear cache)
        $role->refresh();
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();
        $this->assertFalse($role->hasPermissionTo($permission1));
        $this->assertTrue($role->hasPermissionTo($permission2));
    }

    /** @test */
    public function it_can_sync_permissions_for_role()
    {
        // Create a role and permissions
        $role = Role::create(['name' => 'test-role', 'guard_name' => 'web']);
        $permission1 = Permission::create(['name' => 'test-permission-1', 'guard_name' => 'web']);
        $permission2 = Permission::create(['name' => 'test-permission-2', 'guard_name' => 'web']);
        $permission3 = Permission::create(['name' => 'test-permission-3', 'guard_name' => 'web']);

        // Assign initial permissions
        $role->givePermissionTo([$permission1, $permission2]);

        // Sync with different permissions
        $response = $this->postJson("/api/v1/admin/roles/{$role->id}/permissions/sync", [
            'permission_ids' => [$permission2->id, $permission3->id]
        ]);

        $response->assertStatus(200)
                ->assertJson([
                    'success' => true,
                    'message' => 'Permissions synced successfully'
                ]);

        // Verify permissions were synced correctly (refresh the role and clear cache)
        $role->refresh();
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();
        $this->assertFalse($role->hasPermissionTo($permission1));
        $this->assertTrue($role->hasPermissionTo($permission2));
        $this->assertTrue($role->hasPermissionTo($permission3));
    }

    /** @test */
    public function it_can_get_role_permissions()
    {
        // Create a role and permissions
        $role = Role::create(['name' => 'test-role', 'guard_name' => 'web']);
        $permission1 = Permission::create(['name' => 'test-permission-1', 'guard_name' => 'web']);
        $permission2 = Permission::create(['name' => 'test-permission-2', 'guard_name' => 'web']);

        // Assign permissions
        $role->givePermissionTo([$permission1, $permission2]);

        // Get role permissions
        $response = $this->getJson("/api/v1/admin/roles/{$role->id}/permissions");

        $response->assertStatus(200)
                ->assertJson([
                    'success' => true,
                    'message' => 'Role permissions retrieved successfully'
                ])
                ->assertJsonCount(2, 'permissions');
    }

    /** @test */
    public function it_validates_permission_assignment_request()
    {
        $role = Role::create(['name' => 'test-role', 'guard_name' => 'web']);

        // Test with invalid permission IDs
        $response = $this->postJson("/api/v1/admin/roles/{$role->id}/permissions/assign", [
            'permission_ids' => ['invalid-id']
        ]);

        $response->assertStatus(422)
                ->assertJsonValidationErrors(['permission_ids.0']);
    }

    /** @test */
    public function it_returns_404_for_non_existent_role()
    {
        // Create a valid permission for the request
        $permission = Permission::create(['name' => 'test-permission', 'guard_name' => 'web']);
        
        $response = $this->postJson("/api/v1/admin/roles/non-existent-id/permissions/assign", [
            'permission_ids' => [$permission->id]
        ]);

        $response->assertStatus(404)
                ->assertJson([
                    'success' => false,
                    'message' => 'Role not found'
                ]);
    }
}